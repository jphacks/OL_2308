import argparse
import json
import os
import sys
from pathlib import Path

import torch
import torch.nn.functional as F
import torch.utils.checkpoint
import torchvision
from accelerate import Accelerator
from diffusers import DDIMScheduler  # triton
from diffusers.utils import check_min_version  # triton
from diffusers.utils.import_utils import is_xformers_available  # triton
from ladi_vton.src.dataset.dresscode import DressCodeDataset  # triton
from ladi_vton.src.dataset.vitonhd import VitonHDDataset  # triton
#from hubconf import emasc as get_emasc
#from hubconf import extended_unet
#from hubconf import inversion_adapter as get_inversion_adapter
#from hubconf import warping_module as get_warping_module
from ladi_vton.src.models.AutoencoderKL import AutoencoderKL  # triton
from ladi_vton.src.utils.encode_text_word_embedding import \
    encode_text_word_embedding
from ladi_vton.src.utils.set_seeds import set_seed
from ladi_vton.src.utils.val_metrics import compute_metrics
from ladi_vton.src.vto_pipelines.tryon_pipe import \
    StableDiffusionTryOnePipeline  # triton
from PIL import Image
from tqdm import tqdm
from transformers import (AutoProcessor, CLIPTextModel, CLIPTokenizer,
                          CLIPVisionModelWithProjection, logging)

PROJECT_ROOT = Path(__file__).absolute().parents[1].absolute()

# Will error if the minimal version of diffusers is not installed. Remove at your own risks.
check_min_version("0.10.0.dev0")

# モデルに関する不要な警告を非表示
logging.set_verbosity_error()

@torch.inference_mode()
def generate_img(prepare_dict, category):
    args = prepare_dict["args"]
    accelerator = prepare_dict["accelerator"]
    device = prepare_dict["device"]
    val_scheduler = prepare_dict["val_scheduler"]
    text_encoder = prepare_dict["text_encoder"]
    vae = prepare_dict["vae"]
    vision_encoder = prepare_dict["vision_encoder"]
    processor = prepare_dict["processor"]
    tokenizer = prepare_dict["tokenizer"]
    unet = prepare_dict["unet"]
    emasc = prepare_dict["emasc"]
    inversion_adapter = prepare_dict["inversion_adapter"]
    tps = prepare_dict["tps"]
    refinement = prepare_dict["refinement"]
    int_layers = prepare_dict["int_layers"]
    outputlist = prepare_dict["outputlist"]
    val_pipe = prepare_dict["val_pipe"]
    weight_dtype = prepare_dict["weight_dtype"]
    args.category = category
    # Load the datasets
    if args.category != 'all':
        category = [args.category]
    else:
        category = ['dresses', 'upper_body', 'lower_body']

    if args.dataset == "dresscode":
        test_dataset = DressCodeDataset(
            dataroot_path=args.dresscode_dataroot,
            phase='test',
            order=args.test_order,
            radius=5,
            outputlist=outputlist,
            category=args.category,
            size=(512, 384)
        )
    elif args.dataset == "vitonhd":
        test_dataset = VitonHDDataset(
            dataroot_path=args.vitonhd_dataroot,
            phase='test',
            order=args.test_order,
            radius=5,
            outputlist=outputlist,
            category=args.category,
            size=(512, 384),
        )
    else:
        raise NotImplementedError(f"Dataset {args.dataset} not implemented")

    test_dataloader = torch.utils.data.DataLoader(
        test_dataset,
        shuffle=False,
        batch_size=args.batch_size,
    )

    # Prepare the dataloader and create the output directory
    test_dataloader = accelerator.prepare(test_dataloader)
    save_dir = os.path.join(args.output_dir, args.test_order)
    os.makedirs(save_dir, exist_ok=True)
    generator = torch.Generator(device="cuda").manual_seed(args.seed)

    # Generate the images
    for idx, batch in enumerate(test_dataloader):
        model_img = batch.get("image").to(weight_dtype)
        mask_img = batch.get("inpaint_mask").to(weight_dtype)
        if mask_img is not None:
            mask_img = mask_img.to(weight_dtype)
        pose_map = batch.get("pose_map").to(weight_dtype)
        category = batch.get("category")
        cloth = batch.get("cloth").to(weight_dtype)
        im_mask = batch.get('im_mask').to(weight_dtype)

        # mask_hairとmodel_img_pilを追記(画像生成後hair部分をペーストするため)
        mask_hair = batch.get('mask_hair').clone().detach().cpu().numpy()[0]
        mask_hair = Image.fromarray(mask_hair*255)
        mask_hair = mask_hair.convert("1")

        model_img_pil = batch.get("image_row").clone().detach().cpu().numpy()[0]
        model_img_pil = Image.fromarray(model_img_pil)

        # Generate the warped cloth
        # For sake of performance, the TPS parameters are predicted on a low resolution image

        low_cloth = torchvision.transforms.functional.resize(cloth, (256, 192),
                                                             torchvision.transforms.InterpolationMode.BILINEAR,
                                                             antialias=True)
        low_im_mask = torchvision.transforms.functional.resize(im_mask, (256, 192),
                                                               torchvision.transforms.InterpolationMode.BILINEAR,
                                                               antialias=True)
        low_pose_map = torchvision.transforms.functional.resize(pose_map, (256, 192),
                                                                torchvision.transforms.InterpolationMode.BILINEAR,
                                                                antialias=True)
        agnostic = torch.cat([low_im_mask, low_pose_map], 1)
        low_grid, theta, rx, ry, cx, cy, rg, cg = tps(low_cloth, agnostic)

        # We upsample the grid to the original image size and warp the cloth using the predicted TPS parameters
        highres_grid = torchvision.transforms.functional.resize(low_grid.permute(0, 3, 1, 2),
                                                                size=(512, 384),
                                                                interpolation=torchvision.transforms.InterpolationMode.BILINEAR,
                                                                antialias=True).permute(0, 2, 3, 1)

        warped_cloth = F.grid_sample(cloth, highres_grid, padding_mode='border')

        # Refine the warped cloth using the refinement network
        warped_cloth = torch.cat([im_mask, pose_map, warped_cloth], 1)
        warped_cloth = refinement(warped_cloth)
        warped_cloth = warped_cloth.clamp(-1, 1)

        # Get the visual features of the in-shop cloths
        input_image = torchvision.transforms.functional.resize((cloth + 1) / 2, (224, 224),
                                                               antialias=True).clamp(0, 1)
        processed_images = processor(images=input_image, return_tensors="pt")
        clip_cloth_features = vision_encoder(
            processed_images.pixel_values.to(model_img.device, dtype=weight_dtype)).last_hidden_state

        # Compute the predicted PTEs
        word_embeddings = inversion_adapter(clip_cloth_features.to(model_img.device))
        word_embeddings = word_embeddings.reshape((word_embeddings.shape[0], args.num_vstar, -1))

        category_text = {
            'dresses': 'a dress',
            'upper_body': 'an upper body garment',
            'lower_body': 'a lower body garment',

        }
        text = [f'a photo of a model wearing {category_text[category]} {" $ " * args.num_vstar}' for
                category in batch['category']]

        # Tokenize text
        tokenized_text = tokenizer(text, max_length=tokenizer.model_max_length, padding="max_length",
                                   truncation=True, return_tensors="pt").input_ids
        tokenized_text = tokenized_text.to(word_embeddings.device)

        # Encode the text using the PTEs extracted from the in-shop cloths
        encoder_hidden_states = encode_text_word_embedding(text_encoder, tokenized_text,
                                                           word_embeddings, args.num_vstar).last_hidden_state

        # Generate images
        generated_images = val_pipe(
            image=model_img,
            mask_image=mask_img,
            pose_map=pose_map,
            warped_cloth=warped_cloth,
            prompt_embeds=encoder_hidden_states,
            height=512,
            width=384,
            guidance_scale=args.guidance_scale,
            num_images_per_prompt=1,
            generator=generator,
            cloth_input_type='warped',
            num_inference_steps=args.num_inference_steps
        ).images

        # Save images
        for gen_image, cat, name in zip(generated_images, category, batch["im_name"]):
            if not os.path.exists("../output"):
                os.makedirs("../output")

            if args.use_png:
                name = name.replace(".jpg", ".png")
                gen_image.save(
                    "../output/output.png")
            else:
                # 生成画像に元の画像のhair部分をペースト
                if args.category == "upper_body":
                    gen_image.paste(model_img_pil, None, mask_hair)
                gen_image.save(
                    "../static/output.jpg", quality=95)

    # Free up memory
    del val_pipe
    del text_encoder
    del vae
    del emasc
    del unet
    del tps
    del refinement
    del vision_encoder
    torch.cuda.empty_cache()

    if args.compute_metrics:
        metrics = compute_metrics(save_dir, args.test_order, args.dataset, args.category, ['all'],
                                  args.dresscode_dataroot, args.vitonhd_dataroot)

        with open(os.path.join(save_dir, f"metrics_{args.test_order}_{args.category}.json"), "w+") as f:
            json.dump(metrics, f, indent=4)

