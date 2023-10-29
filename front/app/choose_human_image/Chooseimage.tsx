import {
  Box,
  Button,
  Center,
  FormControl,
  FormLabel,
  HStack,
  Image,
  Radio,
  RadioGroup,
  Stack,
  Text,
  VStack,
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
        <Button as="a" colorScheme="yellow" href="/choose-closet-image">
          クローゼットから選ぶ
        </Button>
      </Center>
    </Box>
  );
}
