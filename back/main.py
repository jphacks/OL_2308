import argparse
import glob
import os
import queue
import sys
import threading
import warnings

import cv2
import numpy as np
from PIL import Image

from cloths_segmentation.pre_trained_models import create_model
from detectron2.config import CfgNode, get_cfg
from ladi_vton.src.inference_from_prepare import generate_img
from ladi_vton.src.prepare import prepare_ladi_vton

os.environ['KMP_DUPLICATE_LIB_OK'] = 'TRUE'

#import pprint
#pprint.pprint(sys.path)
#sys.exit()

def prepare(category, q1):
    prepare_dict = prepare_ladi_vton(category)
    q1.put(prepare_dict)

def get_mask_of_cloth():
    # Get mask of cloth
    print("Get mask of cloth\n")
    terminnal_command = "python get_cloth_mask.py" 
    os.system(terminnal_command)

def get_openpose_coordinate_using_posenet():
    # Get openpose coordinate using posenet
    print("Get openpose coordinate using posenet\n")
    terminnal_command = "python posenet.py" 
    os.system(terminnal_command)

def generate_semantic_img(ori_img):
    # Generate semantic segmentation using Graphonomy-Master library
    print("Generate semantic segmentation using Graphonomy-Master library\n")
    os.chdir("./Graphonomy-master")
    terminnal_command ="python exp/inference/inference.py --loadmodel ./inference.pth --img_path ../resized_img.jpg --output_path ../ --output_name /resized_segmentation_img"
    os.system(terminnal_command)
    os.chdir("../")

    # Remove background image using semantic segmentation mask
    """mask_img=cv2.imread('./resized_segmentation_img.png',cv2.IMREAD_GRAYSCALE)
    mask_img=cv2.resize(mask_img,(384,512))
    k = cv2.getStructuringElement(cv2.MORPH_RECT, (3,3))
    mask_img = cv2.erode(mask_img, k)
    img_seg=cv2.bitwise_and(ori_img,ori_img,mask=mask_img)
    back_ground=ori_img-img_seg
    img_seg=np.where(img_seg==0,215,img_seg)
    cv2.imwrite("./seg_img.png",img_seg)
    img=cv2.resize(img_seg,(384,512))
    cv2.imwrite('./ladi_vton/test/test/image/00001_00.jpg',img)"""

    # Generate grayscale semantic segmentation image
    terminnal_command ="python get_seg_grayscale.py"
    os.system(terminnal_command)

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--background', type=bool, default=True, help='Define removing background or not')
    opt = parser.parse_args()
    threads = []

    # prepare ladi-vton
    import time
    starttime = time.time()
    q1 = queue.Queue()
    thread1 = threading.Thread(target=prepare, args=("upper_body", q1))
    threads.append(thread1)
    thread1.start()   

    # Read input image
    img=cv2.imread("./static/origin_web.jpg")
    ori_img=cv2.resize(img,(384,512))
    cv2.imwrite("./origin.jpg",ori_img)
    cv2.imwrite('./ladi_vton/test/test/image/00001_00.jpg',ori_img)

    # Resize input image
    img=cv2.imread('origin.jpg')
    img=cv2.resize(img,(384,512))
    cv2.imwrite('resized_img.jpg',img)

    # Get mask of cloth
    thread2 = threading.Thread(target=get_mask_of_cloth)
    threads.append(thread2)
    thread2.start()

    # Get openpose coordinate using posenet
    thread3 = threading.Thread(target=get_openpose_coordinate_using_posenet)
    threads.append(thread3)
    thread3.start()

    # Generate semantic segmentation using Graphonomy-Master library
    thread4 = threading.Thread(target=generate_semantic_img, args=(ori_img, ))
    threads.append(thread4)
    thread4.start()

    # 各スレッドが終了するまで待機
    for t in threads:
        t.join()

    # 服の矩形抽出
    terminnal_command = "python clip_cloth.py" 
    os.system(terminnal_command)

    # Run Ladi-VTON to generate final image
    print("\nRun Ladi-VITON to generate final image\n")
    while True:
        if not q1.empty():
            prepare_dict = q1.get()
            break
    os.chdir("./ladi_vton")
    generate_img(prepare_dict)
    os.chdir("../")

    # Add Background or Not
    l=glob.glob("./output/*.jpg")
    print(time.time()-starttime)

    # Add Background
    """if opt.background:
        for i in l:
            img=cv2.imread(i)
            img=cv2.bitwise_and(img,img,mask=mask_img)
            img=img+back_ground
            cv2.imwrite(i,img)

    # Remove Background
    else:
        for i in l:
            img=cv2.imread(i)
            cv2.imwrite(i,img)

    os.chdir("../")
    cv2.imwrite("./static/finalimg.png", img)"""