"use client";
import { useEffect, useState } from "react";

import { Box, Button, Center, Text } from "@chakra-ui/react";
import axios from "axios";

const Result = () => {
  const [favoriteAdded, setFavoriteAdded] = useState(false);
  const [imageFiles, setImageFiles] = useState([]);

  useEffect(() => {
    handleUploadResult(); // ページが最初に読み込まれたときに画像を取得して imageFiles ステートに保存
  }, []);

  const handleUploadResult = async () => {
    try {
      const response = await axios.get("http://localhost:5000/try_on_result");
      const closetImages = response.data.imageList;
      setImageFiles(closetImages);
      console.log(imageFiles);
    } catch (error) {
      console.error("エラーが発生しました", error);
    }
  };

  const handleUploadfavorite = async () => {
    try {
      const response = await axios.post("http://localhost:5000/try_on_save", {
        image: imageFiles,
      });
      setFavoriteAdded(true);
    } catch (error) {
      console.error("お気に入りのコーディネートの保存に失敗しました");
    }
  };

  return (
    <Box p={3}>
      <Center>
        <Text fontSize="4xl" fontWeight="bold" color="black.500" mt={2}>
          試着完了！
        </Text>
      </Center>
      <Center mt={4} mb={4}>
        <img
          src={`http://localhost:5000/static/output.jpg`}
          width={384}
          height={512}
          alt="output_img"
        />
      </Center>
      <Center>
        <Button
          onClick={handleUploadfavorite}
          disabled={favoriteAdded}
          colorScheme="blue"
        >
          {favoriteAdded ? "お気に入りに追加済み" : "My coordinateに保存"}
        </Button>
      </Center>
      <Center mt={4}>
        <Button as="a" colorScheme="blue" href="/">
          Homeに戻る
        </Button>
      </Center>
    </Box>
  );
};

export default Result;
