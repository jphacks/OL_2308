'use client'

import {
  Box,
  Button,
  Text,
  Textarea,
  VStack,
  Heading,
  Container,
  Image,
  Flex,
  Spacer,
  Avatar
} from '@chakra-ui/react';

import React, { useState } from 'react';
import { NextPage } from 'next';
import { ask } from '../../pages/api/messages';
  
const Page: NextPage = () => {
  const [prompt, setPrompt] = useState('');
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);  // ローディング状態を追加

  const allIndexes = Array.from({ length: history.length }, (_, index) => index);

  const handleSubmit = async (e: any) => {
      e.preventDefault();
      setIsLoading(true);
      try {
        const response = await ask(prompt, history);  // 履歴を渡す
        const newEntry = { prompt, response: response ?? '' };
        setHistory([...history, newEntry]);
        setPrompt('');
      } catch (error) {
        console.log(error);
      }
      setIsLoading(false);
    };

  const clearHistory = () => {
    setHistory([]);
  };

  return (
    <Container maxW="container.md" minH="100vh">
      <VStack spacing={4} p={4}>
        <Heading as="h1" size="2xl">質問応答ページ</Heading>
        <Box boxSize="300px">
          <Image src="/Images/chat.png"/>
        </Box>
        <Text>
          このページでは<strong>どれすたいる</strong>に質問することができます．
          質問を送信すると、AIが応答してくれます．
          質問と回答の履歴はある程度保持されるため、連続して質問できます．
          ファッションに関する相談に乗ってくれたり，アプリに関する情報を教えてくれます．
        </Text>
      </VStack>
      <Box mt={4} p={4} bg="white" borderRadius="md" boxShadow="sm">
        {history.map((entry, index) => (
          <VStack key={index} spacing={4} alignItems="start" mb={6}>
            <Flex direction="row" alignItems="flex-end">
              <Avatar boxSize={6} color="gray.500" mr={3} />
              <Flex direction="column" p={3} mb={2} bg="#e6e6e6" borderRadius="20px" borderBottomLeftRadius={0}>
                <Text fontSize="sm" color="gray.800">質問 {index + 1}</Text>
                <Text mt={2} color="gray.600">{entry.prompt}</Text>
              </Flex>
            </Flex>
            <Flex direction="row" alignItems="flex-start" ml="auto" gap='2'>
              <Flex direction="column" p={3} bg="#f7f7f7" borderRadius="20px" borderTopRightRadius={0}>
                <Text fontSize="sm" color="gray.800">回答</Text>
                <Text mt={2} color="gray.700">{entry.response}</Text>
              </Flex>
              <Image src="/images/icon.jpg" alt="アプリケーション名" boxSize="60px" borderRadius="full" boxShadow="xl" mt={-5} />
            </Flex>
          </VStack>
        ))}
      </Box>
      <VStack spacing={4} p={4} mt={4} >
        <form onSubmit={handleSubmit}>
          <VStack spacing={4} p={4} bg="gray.50" borderRadius="md" boxShadow="sm" >
            <Heading as="label" size="sm" htmlFor="Prompt">
              質問文
            </Heading>
            <Textarea
              rows={3}
              placeholder="ここに質問を入れてください"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  handleSubmit(e);
                }
              }}
            />
            <Button type="submit" colorScheme="blue" isLoading={isLoading}>
              質問する
            </Button>
          </VStack>
        </form>
        <Button onClick={clearHistory} colorScheme="red">
          履歴を消去
        </Button>
      </VStack>
    </Container>
  );
};

export default Page;