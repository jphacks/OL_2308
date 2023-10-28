"use client"

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, Button, Center, Flex, HStack, Heading, Image, LinkBox, LinkOverlay, Text, VStack } from "@chakra-ui/react";
import NextLink from 'next/link'

export default function Home() {



  useEffect(() => {
    createImageButton
  }, []); // ページが読み込まれた時に実行


  const createImageButton = (imgSrc, altText, href, description) => (
    <LinkBox
      p={4} 
      as="article"  
      bg="yellow.200"
      borderRadius='lg'
      transition="transform 0.3s ease-in-out"
      _hover={{ transform: 'scale(1.15)' }}
      >
      <VStack spacing={2}>
        <Box
          boxSize="200px"
          borderRadius='lg'
        >
          <Image src={imgSrc} boxSize="200px" alt={altText} borderRadius='lg'/>
          <LinkOverlay as={NextLink} href={href} />
        </Box>
        <Text padding={2}>{description}</Text>
      </VStack>
    </LinkBox>
  );
  


  return (
    <Flex
      direction="column"
      align="center"
      minH="100vh"
      p={4}
    >
      <Text fontSize="4xl" fontWeight="bold" color="black.500" mt={2} mb={4}>
        Myクローゼット
      </Text>
      <Flex
        w="100%"
        p={8}
        alignItems="center"
        justify="center"
        backgroundImage="url('/images/mycloset.png')" // 画像のパスを指定
        backgroundSize="cover" // 画像をコンテナに合わせて拡大/縮小
        backgroundRepeat="no-repeat" // 画像の繰り返しを無効化
        backgroundPosition="center" // 画像を中央に配置
        minHeight="100vh" // ページ全体の高さに設定
      >
        <Center h="100%">
          <HStack spacing={8} >
            {createImageButton("/images/closet.png", "クローゼットの中を見る", "/closet", "仮想試着機能で商品を試してみましょう。")}  
            {createImageButton("/images/your_fav_view.png", "お気に入りに登録したコーデ", "/your-favorite-view", "お気に入りに登録したコーディネート。")}
            {createImageButton("/images/search_fav_view.png", "検索した画像", "/search-favorite-view", "あなたの持っているアイテムを管理します。")}
          </HStack>
        </Center>
      </Flex>
    </Flex>
  );
}
