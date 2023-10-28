// components/Footer.tsx

import { 
  Flex, 
  Text, 
  Link as ChakraLink, 
  Spacer,
  HStack
} from "@chakra-ui/react";
import Link from "next/link";

const Footer = () => {
  return (
    <Flex 
      as="footer" 
      bg="#FFFF99" 
      padding={4} 
      alignItems="center" 
      justifyContent="space-between" 
      width="100%" 
      boxShadow="md"
      mt={8}
      flexDirection="column"  // 追加: フッターコンテンツを縦方向に並べる
    >
      <HStack spacing={5} mb={2}>  // 追加: 名前のセット
        <Text fontSize="sm" color="gray.600">落合 翔馬</Text>
        <Text fontSize="sm" color="gray.600">中野 将弥</Text>
        <Text fontSize="sm" color="gray.600">森下 雅晴</Text>
        <Text fontSize="sm" color="gray.600">中塚 陸登</Text>
      </HStack>

      <Text fontSize="md" color="gray.600">2023 JPhacks ol_2308</Text>

      <Flex>
        <Link href="/terms" passHref>
          <ChakraLink fontSize="sm" marginRight={5} _hover={{ textDecoration: 'underline' }}>
            利用規約
          </ChakraLink>
        </Link>
        <Link href="/privacy" passHref>
          <ChakraLink fontSize="sm" _hover={{ textDecoration: 'underline' }}>
            プライバシーポリシー
          </ChakraLink>
        </Link>
      </Flex>
      <Flex>
        <Text fontSize="md" color="gray.600">Doresstyle</Text>
      </Flex>
    </Flex>
  );
};

export default Footer;
