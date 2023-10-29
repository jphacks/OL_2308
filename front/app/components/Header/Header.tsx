'use client';

import { 
  Text, 
  Link, 
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
import NextLink from "next/link";
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
      <Link as={NextLink} 
      href="/">
        <Image src="/images/icon.jpg" alt="アプリケーション名" boxSize="70px" borderRadius="full" boxShadow="xl"/>
      </Link>

      <HStack spacing={7}>
        <Link
          as={NextLink}
          padding={2}
          href="/"
          fontSize="lg"
          fontWeight="semibold"
          rounded="md"
          transition="all 0.2s"
          _hover={{ bg: "#FFFDE7", textDecoration: 'underline' }}
        >
          Home
        </Link>
        <Link
          as={NextLink}
          padding={2}
          href="/try-on"
          fontSize="lg"
          fontWeight="semibold"
          rounded="md"
          transition="all 0.2s"
          _hover={{ bg: "#FFFDE7", textDecoration: 'underline' }}
        >
          Try-on
        </Link>
        <Link
          as={NextLink}
          padding={2}
          href="/coordination"
          fontSize="lg"
          fontWeight="semibold"
          rounded="md"
          transition="all 0.2s"
          _hover={{ bg: "#FFFDE7", textDecoration: 'underline' }}
        >
          Search
        </Link>
        <Link
          as={NextLink}
          padding={2}
          href="/item"
          fontSize="lg"
          fontWeight="semibold"
          rounded="md"
          transition="all 0.2s"
          _hover={{ bg: "#FFFDE7", textDecoration: 'underline' }}
        >
          My-Closet
        </Link>
        <Link
          as={NextLink}
          padding={2}
          href="/chat"
          fontSize="lg"
          fontWeight="semibold"
          rounded="md"
          transition="all 0.2s"
          _hover={{ bg: "#FFFDE7", textDecoration: 'underline' }}
        >
          Assistant
        </Link>
        <Menu>
          <MenuButton 
            as={Button}
            rightIcon={<ChevronDownIcon />} 
            fontSize="lg" 
            fontWeight="semibold" 
            rounded="md" 
            transition="all 0.2s"
            _hover={{ bg: "#FFFDE7", textDecoration: 'underline' }}
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
            <Link as={NextLink} href="/zozo">
              <MenuItem bg="#FFFDE7" fontSize="md" fontWeight="medium" _hover={{ bg: "#EDEDED", borderRadius: "md" }}>ZOZOTOWN</MenuItem>
            </Link>
            <Link as={NextLink} href="/fifth">
              <MenuItem bg="#FFFDE7" fontSize="md" fontWeight="medium" _hover={{ bg: "#EDEDED", borderRadius: "md" }}>fifth</MenuItem>
            </Link>
            <Link as={NextLink} href="/otonastyle">
              <MenuItem bg="#FFFDE7" fontSize="md" fontWeight="medium" _hover={{ bg: "#EDEDED", borderRadius: "md" }}>Otonastyle</MenuItem>
            </Link>
            <Link as={NextLink} href="/buyma">
              <MenuItem bg="#FFFDE7" fontSize="md" fontWeight="medium" _hover={{ bg: "#EDEDED", borderRadius: "md" }}>BUYMA</MenuItem>
            </Link>
            <Link as={NextLink} href="/pierrot">
              <MenuItem bg="#FFFDE7" fontSize="md" fontWeight="medium" _hover={{ bg: "#EDEDED", borderRadius: "md" }}>Pierrot</MenuItem>
            </Link>
          </MenuList>
        </Menu>
      </HStack>
    </Flex>
  );
};

export default Header;
