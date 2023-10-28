"use client";

import { Box, Button, Center, Flex, HStack, Heading, Image, LinkBox, LinkOverlay, Text, VStack } from "@chakra-ui/react";
import { NextPage } from "next";
import NextLink from 'next/link'

const HomePage: NextPage = () => {
  return (
    <Flex
      direction="column"
      // minH="100vh"
      align="center"
      justifyContent="space-between"
    >
      <Flex
        w="full"
        h="60vh"
        bg={`url('/images/back_image.jpg') center/cover`} 
        align="center"
        justify="center"
      >
        <VStack spacing={8} mt={-20}>
          <Heading as="h1" size="3xl" fontWeight="black" color="#FFFFAA" mb={-5} textShadow={"2px 2px 4px rgba(0, 0, 0, 0.5)"}>
            どれすたいる
          </Heading>
          <Box w="full" h="4px" bgColor="pink.400" mt={-2} />
          <Heading as="h2" size="xl" fontWeight="medium" color="#FFFF99" mt={-8} textShadow={"2px 2px 4px rgba(0, 0, 0, 0.5)"}>
            Dresstyle
          </Heading>
          <Button as="a" href="/try-on" color="teal.500" transition="transform 0.3s ease-in-out" _hover={{ transform: 'scale(1.15)' }}>
            Try-On
          </Button>
        </VStack>
      </Flex>
      <Box
        w="100%"
        bg="gray.50"
        p={8}
        alignItems="center"
      >
        <Center h="100%">
          <HStack spacing={8} >
            {createImageButton("/images/try-on.png", "試着", "/try-on", "仮想試着機能で商品を試してみましょう。")}  
            {createImageButton("/images/shopping.png", "コーディネート検索", "/coordination", "お気に入りのコーディネートを検索します。")}
            {createImageButton("/images/item.png", "クローゼット", "/item", "あなたの持っているアイテムを管理します。")}
          </HStack>
        </Center>
      </Box>
    </Flex>
  );
};

const createImageButton = (imgSrc, altText, href, description) => (
  <LinkBox 
    as="a" href={href} 
    p={4}
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

export default HomePage;
