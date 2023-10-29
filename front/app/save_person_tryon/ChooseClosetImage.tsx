"use client";

import { Box, Button, Center, Grid, Text } from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const [imageGet, setImageGet] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    searchImageView();
  }, []); // ページが読み込まれた時に実行

  const searchImageView = async () => {
    try {
      const response = await axios.post("http://localhost:5000/choose_cloth");
      const closetImages = response.data.imageList;
      setImageGet(closetImages);
    } catch (error) {
      console.error("Error fetching favorite images", error);
    }
  };

  const chooseImage = async (filename: string) => {
    try {
      await axios.post("http://localhost:5000/closet_human", {
        image: filename,
      });

      // try-onページに遷移
      router.push("./try-on");
    } catch (error) {
      console.error("Failed to save favorite", error);
    }
  };

  return (
    <Box p={4}>
      <Box>
        {imageGet && imageGet.length > 0 ? (
          <Box mt={4} p={6}>
            <Center>
              <Text fontSize="xl" p={2}>
                クローゼット
              </Text>
            </Center>
            <Grid
              templateColumns="repeat(auto-fill, minmax(200px, 1fr))"
              gap={4}
            >
              {imageGet.map((imageFileName, index) => (
                <Box
                  key={index}
                  p={4}
                  borderWidth="1px"
                  borderRadius="lg"
                  overflow="hidden"
                  position="relative"
                  height={420}
                  border="1px solid gray"
                >
                  <img
                    src={`http://localhost:5000/static/closet/${imageFileName}`}
                    alt={`${index}`}
                    width={250}
                  />
                  <Center>
                    <Button
                      mt={2}
                      colorScheme="blue"
                      onClick={() => chooseImage(imageFileName)}
                      position="absolute"
                      bottom={4}
                      left="50%"
                      transform="translateX(-50%)"
                    >
                      選択
                    </Button>
                  </Center>
                </Box>
              ))}
            </Grid>
          </Box>
        ) : (
          <Text mt={4}>No search results available.</Text>
        )}
      </Box>
    </Box>
  );
}
