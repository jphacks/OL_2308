"use client";

import {
  Box,
  Image,
  Text,
  VStack
} from "@chakra-ui/react";

const Loading = () => {
  return (
    <Box p={6}minH="75vh">
      

      <VStack spacing={4}>
        <Text fontSize="3xl" fontWeight="bold" color="black.500" mt={2}>
          読み込み中...
        </Text>
        <Image
          src="/images/fitting.jpg"
          width={500}
          alt="output_img"
          objectFit="contain"
        />
        <Image
          src="/images/loading.gif"
          width={400}
          height={100}
          alt="output_img"
          objectFit="contain"
        />
      </VStack>
    </Box>
    
  );
};

export default Loading;