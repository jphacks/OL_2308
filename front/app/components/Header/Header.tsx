'use client';

import { 
  Text, 
  Link as ChakraLink, 
  Flex, 
  Image, 
  HStack, 
  Menu, 
  MenuList,
  MenuButton, 
  MenuItem, 
  Box,
  Button  
} from "@chakra-ui/react";
import Link from "next/link";
import { ChevronDownIcon } from '@chakra-ui/icons'

const Header = () => {
  return (
    <Flex 
      as="header" 
      bg="#FFFF99" 
      padding={4} 
      alignItems="center" 
      justifyContent="space-between" 
      width="100%" 
      boxShadow="md"
    >
      <Link href="/" passHref>
        <ChakraLink>
          <Image src="/images/icon.jpg" alt="アプリケーション名" boxSize="70px" borderRadius="full" boxShadow="xl"/>
        </ChakraLink>
      </Link>

      <HStack spacing={7}>
        <Link href="/" passHref>
          <ChakraLink fontSize="lg" fontWeight="semibold" _hover={{ textDecoration: 'underline' }}>
            Home
          </ChakraLink>
        </Link>
        <Link href="/try-on" passHref>
          <ChakraLink fontSize="lg" fontWeight="semibold" _hover={{ textDecoration: 'underline' }}>
            Try-on
          </ChakraLink>
        </Link>
        <Link href="/coordination" passHref>
          <ChakraLink fontSize="lg" fontWeight="semibold" _hover={{ textDecoration: 'underline' }}>
            Search
          </ChakraLink>
        </Link>
        <Link href="/item" passHref>
          <ChakraLink fontSize="lg" fontWeight="semibold" _hover={{ textDecoration: 'underline' }}>
            My-Closet
          </ChakraLink>
        </Link>
        <Menu>
          <MenuButton 
            as={Button}
            rightIcon={<ChevronDownIcon />} 
            fontSize="lg" 
            fontWeight="semibold" 
            rounded="md" 
            transition="all 0.2s"
            _hover={{ bg: "#FFFDE7" }}
            bg="#FFFF99"
          >
            Fashion-site
          </MenuButton>
          <MenuList 
          mt={2} 
          bg="#FFFDE7" 
          borderColor="#DDD" 
          boxShadow="xl"
          >
            <Link href="/zozo" passHref>
              <MenuItem as={ChakraLink} bg="#FFFDE7" fontSize="md" fontWeight="medium" _hover={{ bg: "#EDEDED", borderRadius: "md" }}>ZOZOTOWN</MenuItem>
            </Link>
            <Link href="/fifth" passHref>
              <MenuItem as={ChakraLink} bg="#FFFDE7" fontSize="md" fontWeight="medium" _hover={{ bg: "#EDEDED", borderRadius: "md" }}>fifth</MenuItem>
            </Link>
            <Link href="/otonastyle" passHref>
              <MenuItem as={ChakraLink} bg="#FFFDE7" fontSize="md" fontWeight="medium" _hover={{ bg: "#EDEDED", borderRadius: "md" }}>Otonastyle</MenuItem>
            </Link>
            <Link href="/buyma" passHref>
              <MenuItem as={ChakraLink} bg="#FFFDE7" fontSize="md" fontWeight="medium" _hover={{ bg: "#EDEDED", borderRadius: "md" }}>BUYMA</MenuItem>
            </Link>
            <Link href="/pierrot" passHref>
              <MenuItem as={ChakraLink} bg="#FFFDE7" fontSize="md" fontWeight="medium" _hover={{ bg: "#EDEDED", borderRadius: "md" }}>Pierrot</MenuItem>
            </Link>
          </MenuList>
        </Menu>
      </HStack>
    </Flex>
  );
};

export default Header;
