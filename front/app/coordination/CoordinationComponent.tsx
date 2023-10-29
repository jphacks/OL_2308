"use client";

import {
  Box,
  Button,
  Center,
  Container,
  Grid,
  Input,
  Select,
  Text,
  VStack
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import Loading from "../loading/page";

export default function Home() {
  const [season, setSeason] = useState<string>('');
  const [age, setAge] = useState<string>('');
  const [heorshe, setHeorshe] = useState<string>('');
  const [scene, setScene] = useState<string>('');
  const [freeWord, setFreeWord] = useState<string>('');
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [showCount, setShowCount] = useState(0)
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isloading, setIsloading] = useState(false);

  const handleSearch = async () => {
    try {
      handleinit();
      setIsloading(true);
      const response = await axios.post('http://localhost:5000/image_search', {
        season,
        scene,
        age,
        heorshe,
        freeWord,
      });

      console.log(response);
      const imageFiles = response.data.imageList; // 注意: キーは "imageList" です
      console.log(imageFiles);

      setSearchResults(imageFiles);



      setSeason('');
      setScene('');
      setHeorshe('');
      setAge('');
      setFreeWord('');
      //setSearchResults([]);
      setShowCount(showCount => +1);
      setIsloading(false);
      
    } catch (error) {
      console.error("ERROR calling flask api", error);
    }
  };

  const handleinit = () => {
    setSearchResults([""]);
    setFavorites([""]);
  };

  const handleFavorite = async (imageFileName: string) => {
    try {
      // お気に入りのコーデをバックエンドに保存
      await axios.post('http://localhost:5000/search_save', {
        image: imageFileName,
      });

      setFavorites((prevFavorites) => [...prevFavorites, imageFileName]);
    } catch (error) {
      console.error("Failed to save favorite", error);
    }
  };

  if (isloading) {
    return<Loading />;
  };



  return (
    <Box p={4} minHeight="100vh">
      <Container>
        <VStack spacing={4}>
          <Text fontSize="4xl" fontWeight="bold" color="black.500" mt={2}>
            キーワード検索
          </Text>
          <Select
            placeholder="性別"
            value={heorshe}
            onChange={(e) => setHeorshe(e.target.value)}
          >
            <option value="男性">男性</option>
            <option value="女性">女性</option>
          </Select>
          <Select
            placeholder="季節"
            value={season}
            onChange={(e) => setSeason(e.target.value)}
          >
            <option value="春">春</option>
            <option value="夏">夏</option>
            <option value="秋">秋</option>
            <option value="冬">冬</option>
          </Select>
          <Select
            placeholder="年齢"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          >
            <option value="10代">10代</option>
            <option value="20代">20代</option>
            <option value="30代">30代</option>
            <option value="40代">40代</option>
            <option value="50代">50代</option>
            <option value="60代">60代</option>
            <option value="70代">70代</option>
            <option value="80代">80代</option>
          </Select>
          <Input
            type="text"
            placeholder="場面"
            value={scene}
            onChange={(e) => setScene(e.target.value)}
          />
          <Text fontSize="4xl" fontWeight="bold" color="black.500" mt={2}>
            フリーワード検索
          </Text>
          <Input
            type="text"
            placeholder="フリーワード"
            value={freeWord}
            onChange={(e) => setFreeWord(e.target.value)}
          />
          <Button colorScheme="blue" onClick={handleSearch}>
            Search
          </Button>
        </VStack>
      </Container>
      <Box>
      {searchResults && searchResults.length > 0 ? (
          <Box mt={4} p={6}>
            <Center>
              <Text fontSize="xl" p={2}>お探しのコーデは:</Text>
            </Center>
          <Grid templateColumns="repeat(auto-fill, minmax(200px, 1fr))" gap={4}>
            {searchResults.map((imageFileName, index) => (
              <Box key={showCount} p={4} borderWidth="1px" borderRadius="lg" overflow="hidden" position="relative" height={420} border="1px solid gray">
                <img
                  src={`http://localhost:5000/static/search_image/${imageFileName}?timestamp=${new Date().getTime()}`}
                  alt={`${index}`}
                  width={250}
                />
                {favorites.includes(imageFileName) ? (
                  <Text mt={2} color="green.500">
                    登録しました!!
                  </Text>
                ) : (
                  <Center>
                    <Button
                      mt={2}
                      colorScheme="blue"
                        onClick={() => handleFavorite(imageFileName)}
                        position="absolute" bottom={4} left="50%" transform="translateX(-50%)"
                    >
                      お気に入り
                    </Button>
                  </Center>
                )}
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