from flask import Flask, request, send_file, jsonify
from flask_cors import CORS, cross_origin
from PIL import Image
from io import BytesIO

#Web画像検索用ライブラリ
from icrawler.builtin import BingImageCrawler
import os, glob
import json
import sys
import shutil
import time
from datetime import datetime



app = Flask(__name__, root_path = os.getcwd(), static_url_path = '/static', static_folder = 'static')
CORS(app)

@app.route('/', methods=['POST'])
@cross_origin()
def file_upload():
    request_data = request.get_json()
    body_part = request_data.get('bodyPart')
    print(body_part)
    
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
    heorshe = data["heorshe"]

    search_keywords = f"{heorshe} {space} {season} {space} {code} {space} {scene} {space} {age} {space} {freeWord}"

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
    closet_dir = "./static/my_closet"
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

#try onをして生成された自分の画像名の一覧を渡す
@app.route('/your_favorite_viewer', methods = ['POST'])
@cross_origin()
def your_favorite_viewer():
    closet_dir = "./static/your_favorite_image"
    image_files = os.listdir(closet_dir)
    responce_data = {"imageList": image_files}
    return jsonify(responce_data)

'''''
使わないのでコメントアウト
@app.route('/get_image_list', methods=['GET'])
@cross_origin()
def get_image_list():
    image_dir = "./static/search_image"
    image_files = os.listdir(image_dir)
    return jsonify(imageList=image_files)
'''''



if __name__ == '__main__':
    app.run( debug = False, port=5000)
