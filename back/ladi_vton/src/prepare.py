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


def parse_args():
    parser = argparse.ArgumentParser(description="Full inference script")

    parser.add_argument(
        "--pretrained_model_name_or_path",
        type=str,
        default="stabilityai/stable-diffusion-2-inpainting",
        help="Path to pretrained model or model identifier from huggingface.co/models.",
    )

    parser.add_argument(
        "--output_dir",
        default="Output",
        type=str,
        help="Path to the output directory",
    )

    parser.add_argument("--seed", type=int, default=1234, help="A seed for reproducible training.")
    parser.add_argument("--batch_size", type=int, default=8, help="Batch size to use.")

    parser.add_argument(
        "--mixed_precision",
        type=str,
        default=None,
        choices=["no", "fp16", "bf16"],
        help=(
            "Whether to use mixed precision. Choose between fp16 and bf16 (bfloat16). Bf16 requires PyTorch >="
            " 1.10.and an Nvidia Ampere GPU.  Default to the value of accelerate config of the current system or the"
            " flag passed with the `accelerate.launch` command. Use this argument to override the accelerate config."
        ),
    )

    parser.add_argument(
        "--enable_xformers_memory_efficient_attention", action="store_true", help="Whether or not to use xformers."
    )

    parser.add_argument('--dresscode_dataroot', type=str, help='DressCode dataroot')
    parser.add_argument('--vitonhd_dataroot', default="test", type=str, help='VitonHD dataroot')

    parser.add_argument("--num_workers", type=int, default=8,
                        help="The name of the repository to keep in sync with the local `output_dir`.")

    parser.add_argument("--num_vstar", default=16, type=int, help="Number of predicted v* images to use")
    parser.add_argument("--test_order", default="unpaired", type=str, choices=["unpaired", "paired"])
    parser.add_argument("--dataset", default="vitonhd", type=str, choices=["dresscode", "vitonhd"], help="dataset to use")
    #parser.add_argument("--category", type=str, choices=['all', 'lower_body', 'upper_body', 'dresses'], default='upper_body')
    parser.add_argument("--use_png", default=False, action="store_true")
    parser.add_argument("--num_inference_steps", default=50, type=int)
    parser.add_argument("--guidance_scale", default=7.5, type=float)
    parser.add_argument("--compute_metrics", default=False, action="store_true")

    args = parser.parse_args()
    env_local_rank = int(os.environ.get("LOCAL_RANK", -1))
    if env_local_rank != -1 and env_local_rank != args.local_rank:
        args.local_rank = env_local_rank

    return args

def prepare_ladi_vton():

    args = parse_args()

    # Check if the dataset dataroot is provided
    if args.dataset == "vitonhd" and args.vitonhd_dataroot is None:
        raise ValueError("VitonHD dataroot must be provided")
    if args.dataset == "dresscode" and args.dresscode_dataroot is None:
        raise ValueError("DressCode dataroot must be provided")

    # Setup accelerator and device.
    accelerator = Accelerator(mixed_precision=args.mixed_precision)
    device = accelerator.device

    # If passed along, set the training seed now.
    if args.seed is not None:
        set_seed(args.seed)

    # Load scheduler, tokenizer and models.
    val_scheduler = DDIMScheduler.from_pretrained(args.pretrained_model_name_or_path, subfolder="scheduler")
    val_scheduler.set_timesteps(50, device=device)
    text_encoder = CLIPTextModel.from_pretrained(args.pretrained_model_name_or_path, subfolder="text_encoder")
    vae = AutoencoderKL.from_pretrained(args.pretrained_model_name_or_path, subfolder="vae")
    vision_encoder = CLIPVisionModelWithProjection.from_pretrained("laion/CLIP-ViT-H-14-laion2B-s32B-b79K")
    processor = AutoProcessor.from_pretrained("laion/CLIP-ViT-H-14-laion2B-s32B-b79K")
    tokenizer = CLIPTokenizer.from_pretrained(args.pretrained_model_name_or_path, subfolder="tokenizer")

    # modelをローカルから読み込むように変更(hubconf.pyの中身も変更した)
    """unet = extended_unet(args.dataset)
    emasc = get_emasc(args.dataset)
    inversion_adapter = get_inversion_adapter(args.dataset)
    tps, refinement = get_warping_module(args.dataset)"""

    unet = torch.hub.load(repo_or_dir='miccunifi/ladi-vton', source='github', model='extended_unet', dataset=args.dataset)
    emasc = torch.hub.load(repo_or_dir='miccunifi/ladi-vton', source='github', model='emasc', dataset=args.dataset)
    inversion_adapter = torch.hub.load(repo_or_dir='miccunifi/ladi-vton', source='github', model='inversion_adapter', dataset=args.dataset)
    tps, refinement = torch.hub.load(repo_or_dir='miccunifi/ladi-vton', source='github', model='warping_module', dataset=args.dataset)

    int_layers = [1, 2, 3, 4, 5]

    # Enable xformers memory efficient attention if requested
    if args.enable_xformers_memory_efficient_attention:
        if is_xformers_available():
            unet.enable_xformers_memory_efficient_attention()
        else:
            raise ValueError("xformers is not available. Make sure it is installed correctly")


    outputlist = ['image', 'pose_map', 'inpaint_mask', 'im_mask', 'category', 'im_name', 'cloth', 'mask_hair', 'image_row']  # mask_hair, image_rowを追加
    
    # Cast to weight_dtype
    weight_dtype = torch.float32
    if args.mixed_precision == 'fp16':
        weight_dtype = torch.float16

    text_encoder.to(device, dtype=weight_dtype)
    vae.to(device, dtype=weight_dtype)
    emasc.to(device, dtype=weight_dtype)
    inversion_adapter.to(device, dtype=weight_dtype)
    unet.to(device, dtype=weight_dtype)
    tps.to(device, dtype=weight_dtype)
    refinement.to(device, dtype=weight_dtype)
    vision_encoder.to(device, dtype=weight_dtype)

    # Set to eval mode
    text_encoder.eval()
    vae.eval()
    emasc.eval()
    inversion_adapter.eval()
    unet.eval()
    tps.eval()
    refinement.eval()
    vision_encoder.eval()

    # Create the pipeline
    val_pipe = StableDiffusionTryOnePipeline(
        text_encoder=text_encoder,
        vae=vae,
        tokenizer=tokenizer,
        unet=unet,
        scheduler=val_scheduler,
        emasc=emasc,
        emasc_int_layers=int_layers,
    ).to(device)

    prepare_dict = {"args":args, "accelerator":accelerator, "device":device,"val_scheduler":val_scheduler, "text_encoder":text_encoder, "vae":vae, "vision_encoder":vision_encoder, "processor":processor, "tokenizer":tokenizer, "unet":unet, "emasc":emasc, "inversion_adapter":inversion_adapter, "tps":tps, "refinement":refinement, "int_layers":int_layers, "outputlist":outputlist, "val_pipe":val_pipe, "weight_dtype":weight_dtype}
    
    return prepare_dict
