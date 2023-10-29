"use client";

import { useRef, useState } from 'react';

export default function Home() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [capturedImage, setCapturedImage] = useState(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
    } catch (error) {
      console.error('ウェブカメラアクセスエラー:', error);
    }
  };

  const captureImage = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = canvas.toDataURL('image/png');
    setCapturedImage(imageData);
  };

  const sendImageToServer = () => {
    if (capturedImage) {
      const modifiedImageData = capturedImage.replace(/\+/g, '-').replace(/\//g, '!');
      fetch('http://localhost:5000/get-camera-img', {
        method: 'POST',
        body: JSON.stringify({ image: modifiedImageData }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('サーバーからの応答:', data);
        })
        .catch((error) => {
          console.error('エラー:', error);
        });
    }
  };

  return (
    <div>
      <video ref={videoRef} autoPlay />
      <canvas ref={canvasRef} width={640} height={480} style={{ display: 'none' }} />
      <button onClick={startCamera}>ウェブカメラを起動 </button>
      <button onClick={captureImage}>画像をキャプチャ </button>
      <button onClick={sendImageToServer}>画像をサーバーに送信</button>
      {capturedImage && <img src={capturedImage} alt="Captured Image" />}
    </div>
  );
}
