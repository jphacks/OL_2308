import base64
import io
import os
import queue
import shutil
import threading
from datetime import datetime

import cv2
import numpy as np
from flask import Flask, jsonify, redirect, render_template, request, url_for
from flask_cors import CORS, cross_origin
from flask_ngrok import run_with_ngrok
from icrawler.builtin import BingImageCrawler
from PIL import Image
from werkzeug.utils import secure_filename

from main_for_web import prepare, run_vton

q1 = queue.Queue()
thread1 = threading.Thread(target=prepare, args=(q1, ))
thread1.start()   

data_list = []

app = Flask(__name__, root_path = os.getcwd(), static_url_path = '/static', static_folder = 'static')
CORS(app)

@app.route('/', methods=['POST'])
@cross_origin()
def file_upload():
    request_data = request.get_json()
    body_part = request_data.get('bodyPart')
    print(body_part)

    # ladi vton実行
    global prepare_dict
    print("inference start")
    thread1.join()
    if not q1.empty():
        prepare_dict = q1.get()
        print("prepare_dict")
    run_vton(prepare_dict, body_part)

    #terminnal_command ="python main.py"
    #os.system(terminnal_command)
    
    print("inference end")

    os.remove("./static/cloth_web.jpg")
    os.remove("./static/origin_web.jpg")
    
    # フロントエンドに画像とbodyPartを返す
    return jsonify("success")


#画像検索関数

@app.route("/image_search", methods = ['POST'])
@cross_origin()
def image_search():
    data = request.get_json()


    season = data["season"]
    scene = data["scene"]
    age = data["age"]
    freeWord = data["freeWord"]
    code = "コーデ"
    space = "　"
    age_count = "才"

    search_keywords = f"{season} {space} {code} {space} {scene} {space} {age} {age_count} {space} {freeWord}"

    download_dir = "./static/search_image"

    if os.path.isdir(download_dir):
        # すでに存在する場合、クリーンアップして新しい画像をダウンロード
        for file in os.listdir(download_dir):
            file_path = os.path.join(download_dir, file)
            try:
                if os.path.isfile(file_path):
                    os.unlink(file_path)
            except Exception as e:
                print(f"Error: {e}")

    else:
        os.makedirs(download_dir)
    
    crawler = BingImageCrawler(
        storage = {"root_dir": download_dir},
        )
    crawler.crawl(keyword = search_keywords, max_num = 20)
    #ここまでは動作する

        # ダウンロードした画像ファイルのリストを取得
    image_files = os.listdir(download_dir)

    # 画像ファイル名のリストをJSONレスポンスとして返す
    response_data = {"imageList": image_files}
    return jsonify(response_data)

    #return test

# 検索してきた画像を保存する
@app.route('/search_save', methods = ['POST'])
@cross_origin()
def favorite():
    data = request.get_json()
    favorite_image = data["image"]

    # 現在の日付と時刻からファイル名を生成
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")

    filename, file_extension = os.path.splitext(favorite_image)
    new_filename = f"{timestamp}_{filename}{file_extension}"

    image_path = os.path.join("static", "search_favorite_image", new_filename)

    # 静的ディレクトリ/static/search_favorite_imageにお気に入りのコーデを保存
    shutil.copy(os.path.join("static", "search_image", favorite_image), image_path)

    return jsonify({"message": "お気に入りに登録しました!!"})


#現在クローゼットの中にある服の画像名の一覧を渡す
@app.route('/choose_cloth', methods = ['POST'])
@cross_origin()
def closet():
    closet_dir = "./static/closet"
    image_files = os.listdir(closet_dir)
    responce_data = {"imageList": image_files}
    return jsonify(responce_data)

#画像検索ページで「お気に入りボタン」を押した画像名の一覧を渡す
@app.route('/search_favorite_viewer', methods = ['POST'])
@cross_origin()
def search_favorite_viewer():
    closet_dir = "./static/search_favorite_image"
    image_files = os.listdir(closet_dir)
    responce_data = {"imageList": image_files}
    return jsonify(responce_data)


#画像検索ページで保存した画像を、削除したいときに動く
@app.route('/delete_search_save', methods = ['POST'])
@cross_origin()
def delete_favorite():
    data = request.get_json()
    delete_image = data["image"]
    delete_image_path = os.path.join("static", "search_favorite_image", delete_image)
    os.remove(delete_image_path)
    return jsonify({"message": "お気に入りを解除しました"})


#try onをして生成された自分の画像名の一覧を渡す
@app.route('/your_favorite_viewer', methods = ['POST'])
@cross_origin()
def your_favorite_viewer():
    closet_dir = "./static/your_favorite_image"
    image_files = os.listdir(closet_dir)
    responce_data = {"imageList": image_files}
    return jsonify(responce_data)



@app.route('/get_image_list', methods=['GET'])
@cross_origin()
def get_image_list():
    image_dir = "./static/search_image"
    image_files = os.listdir(image_dir)
    return jsonify(imageList=image_files)

@app.route('/try_on_result', methods=['GET'])
@cross_origin()
def try_on_result():
    image_files = "./static/output.jpg"
    return jsonify(image_files)

@app.route('/try_on_save', methods=['POST'])
@cross_origin()
def save_try_on_result():
    data = request.get_json()
    favorite_image = data["image"]

    # 現在の日付と時刻からファイル名を生成
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")

    filename, file_extension = os.path.splitext(favorite_image)
    new_filename = f"{timestamp}_{filename}{file_extension}"

    image_path = os.path.join("static", "favorite_image_tryon", new_filename)

    # 静的ディレクトリ/static/favorite_imageにお気に入りのコーデを保存
    shutil.copy(os.path.join("static", favorite_image), image_path)

    return jsonify({"message": "お気に入りに登録しました!!"})

#クローゼットの中の内容を返す
@app.route('/closet_cloth', methods = ['POST'])
@cross_origin()
def closet_cloth():
    data = request.get_json()
    image_filename = data["image"]

    source_path = os.path.join("static", "closet", image_filename)
    destination_path = os.path.join("static", "cloth_web.jpg")

    shutil.copy(source_path, destination_path)

    return jsonify({"message": "Image copied successfully"})

#クローゼットの中の内容を返す
@app.route('/closet_human', methods = ['POST'])
@cross_origin()
def closet_human():
    data = request.get_json()
    image_filename = data["image"]

    source_path = os.path.join("static", "closet", image_filename)
    destination_path = os.path.join("static", "origin_web.jpg")

    shutil.copy(source_path, destination_path)

    return jsonify({"message": "Image copied successfully"})
 
@app.route('/get-camera-img', methods=['POST'])
def upload_image():
    try:
        # クライアントから送信されたデータを取得
        data = request.json
        image_data_url = data.get('image')

        # Data URLから画像データを抽出
        image_data = image_data_url.split(',')[1].encode()
        #print(image_data)
        image_data = image_data.decode()
        image_data = image_data.replace("-", "+")
        image_data = image_data.replace("!", "/")
        image_data = image_data.encode()
        image_data = base64.b64decode(image_data) 
        image_data = np.fromstring(image_data, dtype='uint8')
        image = cv2.imdecode(image_data, 1)
        cv2.imwrite("./static/camera_img.jpg", image)
        
        return 'Image uploaded successfully'

    except Exception as e:
        return str(e), 500

@app.route('/change_extract_image', methods = ['POST'])
@cross_origin()
def change_extract_image():
    data = request.get_json()
    image_filename = data["image"]
    source_path = os.path.join("static", "search_favorite_image", image_filename)
    destination_path = os.path.join("static", "extract_select_image.jpg")
    shutil.copy(source_path, destination_path)
    return jsonify({"message": "Image copied successfully"})

@app.route('/do_extract_image', methods = ['POST'])
@cross_origin()
def do_extract_image():
    data = request.get_json()
    extract_part = data["extractpart"]
    img_path = "./static/extract_select_image.jpg"
    outputpath = "./static"
    outputname = "extracted_done_img.jpg"

    os.system("python .\Graphonomy-master\exp\inference\get_cloth_from_human.py --img_path " + img_path +" --category " + extract_part + " --output_path " + outputpath + ' --output_name ' + outputname)
    #os.system("python clip_cloth.py")

    return jsonify({"message": "Image extract successfully"})

@app.route('/save_extracted_image', methods = ['POST'])
@cross_origin()
def save_extracted_image():
    inputpath = "./static/"
    inputname = "extracted_done_img.jpg"
    outputpath = "./static/closet/"

    _image = os.path.join(inputpath, inputname)

    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")

    filename, file_extension = os.path.splitext(inputname)
    new_filename = f"{timestamp}_{filename}{file_extension}"

    image_path = os.path.join(outputpath, new_filename)

    shutil.copy(_image, image_path)

    return jsonify({"message": "Image extract successfully"})
 
if __name__ == '__main__':
    app.run()