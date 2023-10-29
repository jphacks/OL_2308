import cv2
import numpy as np


def rectangularity(contour):
    '''
    矩形度を求める

    Parameters
    ----------
    contour : ndarray
        輪郭の(x,y)座標の配列

    Returns
    -------
        矩形度

    '''
    # 面積
    area = cv2.contourArea(contour)
    # 傾いた外接する矩形領域
    _, (width, height), _ = cv2.minAreaRect(contour)

    # 矩形度を返す
    if width == 0.0 or height == 0.0:
        return 0.0
    else:
        return area / width / height

def main():
    # 8ビット1チャンネルのグレースケールとして画像を読み込む
    img_mask = cv2.imread("D:/Hackathon/github/virtual-try-on-system/ladi_vton/test/test/cloth-mask/00001_00.jpg", cv2.IMREAD_GRAYSCALE) 
    img = cv2.imread("D:/Hackathon/github/virtual-try-on-system/ladi_vton/test/test/cloth/00001_00.jpg")

    # 白黒反転して二値化
    #ret, img_mask = cv2.threshold(img_mask, 254, 255, cv2.THRESH_BINARY_INV)

    # 一番外側の輪郭のみを取得
    contours, hierarchy = cv2.findContours(img_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE) 

    # 画像表示用に入力画像をカラーデータに変換する
    img_disp = cv2.cvtColor(img_mask, cv2.COLOR_GRAY2BGR)

    # 全ての輪郭を描画
    #cv2.drawContours(img_disp, contours, -1, (0, 0, 255), 2)

    # フレームのサイズ
    frame_height, frame_width = img_mask.shape[:2]

    # 輪郭の点の描画
    max_area = 0
    max_contour = None
    for contour in contours:
        # 傾いた外接する矩形領域の描画
        # 輪郭がフレームのサイズと同じであれば無視
        if cv2.contourArea(contour) == frame_height * frame_width:
            continue
        rect = cv2.minAreaRect(contour)
        box = cv2.boxPoints(rect)
        box = np.intp(box)
        cv2.drawContours(img_disp,[box],0,(0,255,255), 1)
        # 矩形度の計算
        val = rectangularity(contour)
        # 輪郭の矩形領域
        x,y,w,h = cv2.boundingRect(contour)
        # 矩形度の描画
        #cv2.putText(img_disp, f"{val:.3f}", (x, y-10), cv2.FONT_HERSHEY_PLAIN, 2, (0, 255, 0), 1, cv2.LINE_AA)
        # 円らしい領域（円形度が0.85以上）を囲う
        if val > 0.6:
            if not x-40<0:
                left = x-40
            else:
                left = x

            if not y-40<0:
                top = y-40
            else:
                top = y

            if not x+w+40 >= img_disp.shape[1]:
                right = x+w+40
            else:
                right = img_disp.shape[1]-1

            if not y+h+40 >= img_disp.shape[0]:
                bottom = y+h+40
            else:
                bottom = img_disp.shape[0]-1
            
            cv2.rectangle(img_disp,(left,top),(right,bottom),(255,0,0),2) # 少し外側を囲う
            cropped_image_mask = img_mask[top:bottom, left:right]
            cropped_image = img[top:bottom, left:right]
            cv2.imwrite("D:/Hackathon/github/virtual-try-on-system/ladi_vton/test/test/cloth-mask/00001_00.jpg", cropped_image_mask)
            cv2.imwrite("D:/Hackathon/github/virtual-try-on-system/ladi_vton/test/test/cloth/00001_00.jpg", cropped_image)

    #cv2.imshow("Image", img_disp)
    # キー入力待ち(ここで画像が表示される)
    #cv2.waitKey()

    """cropped_image_mask = img_mask[y1-40:y1+h+40, x1-40:x1+w+40]
    cropped_image = img[x1-40:y1+h+40, x1-40:x1+w+40]
    cv2.imwrite("D:/Hackathon/github/virtual-try-on-system/ladi_vton/test/test/cloth-mask/00001_00.jpg", cropped_image_mask)
    cv2.imwrite("D:/Hackathon/github/virtual-try-on-system/ladi_vton/test/test/cloth/00001_00.jpg", cropped_image)"""

if __name__ == '__main__':
    main()