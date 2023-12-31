"use client";
import {
  Button,
  Center
} from "@chakra-ui/react";
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
      <Center mt={4}>
        <video ref={videoRef} autoPlay />
        </Center>
      <canvas ref={canvasRef} width={640} height={480} style={{ display: 'none' }} />
      <Center mt={4}>
        <Button colorScheme="blue" onClick={startCamera}>カメラを起動 </Button>
        <Button colorScheme="red" onClick={captureImage}>撮影 </Button>
        <Button colorScheme="blue" onClick={sendImageToServer}>この画像に決定！</Button>
      </Center>
      <Center mt={4}>
        {capturedImage && <img src={capturedImage} alt="Captured Image" />}
      </Center>
      <Center mt={4}>
            <Button as="a" colorScheme="blue"  onClick={sendImageToServer} href="/try-on">
              試着に戻る
            </Button>
      </Center>
    </div>
  );
}
