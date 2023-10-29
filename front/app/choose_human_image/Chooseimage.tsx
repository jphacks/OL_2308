import {
  Box,
  Button,
  Center
} from "@chakra-ui/react";

export default function Chooseimage() {
  return (
    <Box p={3}>
      <Center mt={4}>
        <Button as="a" colorScheme="blue" href="/">
          画像を撮る
        </Button>
      </Center>
      <Center mt={4}>
        <Button as="a" colorScheme="yellow" href="/save_person_tryon">
          クローゼットから選ぶ
        </Button>
      </Center>
    </Box>
  );
}
