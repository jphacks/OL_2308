import {
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Image,
  Img,
  Radio,
  RadioGroup,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Tryon() {
  const [imageFiles, setImageFiles] = useState([null, null]);
  const [bodyPart, setBodyPart] = useState("");
  const router = useRouter();
  const ClothImage = "";
  const HumanImage = "";

  useEffect(() => {
    handleClothIcon(); // ページが最初に読み込まれたときに画像を取得して imageFiles ステートに保存
    handleHumanIcon();
  }, []);

  const handleClothIcon = () => {
    const imageUrl = "http://localhost:5000/static/cloth_web.jpg"; // ファイルのURL

    // 画像ファイルが存在するかどうかを確認
    fetch(imageUrl)
      .then((response) => {
        if (response.ok) {
          // ファイルが存在する場合
          const ClothImage = imageUrl;
          console.log("Image exists: ", ClothImage);
        }
      })
      .catch((error) => {
        console.error("Error checking image existence: ", error);
      });
  };

  const handleHumanIcon = () => {
    const imageUrl = "http://localhost:5000/static/origin_web.jpg"; // ファイルのURL

    // 画像ファイルが存在するかどうかを確認
    fetch(imageUrl)
      .then((response) => {
        if (response.ok) {
          // ファイルが存在する場合
          const HumanImage = imageUrl;
          console.log("Image exists: ", HumanImage);
        }
      })
      .catch((error) => {
        console.error("Error checking image existence: ", error);
      });
  };

  const handleBodyPartChange = (value) => {
    setBodyPart(value);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("bodyPart", bodyPart); // ボディパートをフォームデータに追加
    router.push("");

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        router.push("");
        console.log("success");
      } else {
        console.error("Error uploading images");
      }
    } catch (error) {
      console.error("Error uploading images", error);
    }
  };

  return (
    <Flex direction="column" align="center" minH="100vh" p={4}>
      <Center>
        <Text fontSize="4xl" fontWeight="bold" color="black.500" mt={2}>
          服の試着
        </Text>
      </Center>
      <Flex
        p={5}
        alignItems="center"
        justify="center"
        backgroundImage="url('/images/fitting_room1.jpg')" // 画像のパスを指定
        backgroundSize="cover" // 画像をコンテナに合わせて拡大/縮小
        backgroundRepeat="no-repeat" // 画像の繰り返しを無効化
        backgroundPosition="center" // 画像を中央に配置
        minHeight="100vh" // ページ全体の高さに設定
      >
        <VStack>
          <HStack spacing={20} mt={4} mb={4} mr={10} ml={10}>
            <Box
              flex={1}
              bg="yellow.200"
              borderRadius="md"
              p={4}
              boxSize="400px"
              width="30%"
              transition="transform 0.3s ease-in-out"
              _hover={{ transform: "scale(1.05)" }}
            >
              <VStack spacing={2}>
                <label>
                  <a href="">
                    <Img
                      src={ClothImage}
                      boxSize="300px"
                      alt="Upload Image"
                      style={{ cursor: "pointer" }} // カーソルをポインターに設定
                    />
                  </a>
                </label>
                <Text>{"服の画像を選択してください"}</Text>
              </VStack>
            </Box>
            <Box
              flex={1}
              bg="yellow.200"
              borderRadius="md"
              p={4}
              boxSize="400px"
              transition="transform 0.3s ease-in-out"
              _hover={{ transform: "scale(1.05)" }}
            >
              <VStack spacing={2}>
                <label>
                  <a href="">
                    <Img
                      src={HumanImage}
                      boxSize="300px"
                      alt="Upload Image"
                      style={{ cursor: "pointer" }} // カーソルをポインターに設定
                    />
                  </a>
                </label>
                <Text>{"人物の画像を選択してください"}</Text>
              </VStack>
            </Box>
          </HStack>
          <Center>
            <Box bg="yellow.200" borderRadius="md" p={4} mt={4} mb={4}>
              <FormControl>
                <FormLabel>
                  <Text fontSize="xl" fontWeight="bold" color="black.500">
                    ボディーパート
                  </Text>
                </FormLabel>
                <RadioGroup
                  value={bodyPart}
                  onChange={handleBodyPartChange}
                  bg="white"
                >
                  <Stack direction="row" spacing={2} p={3}>
                    <Radio value="upper_body">上半身</Radio>
                    <Radio value="lower_body">下半身</Radio>
                    <Radio value="all">全身</Radio>
                    <Radio value="dress">ドレス</Radio>
                  </Stack>
                </RadioGroup>
              </FormControl>
            </Box>
          </Center>
          <Center mt={4}>
            <Button colorScheme="blue" onClick={handleUpload}>
              Try on!!
            </Button>
          </Center>
          <Center mt={4}>
            <Button as="a" colorScheme="blue" href="/">
              Homeに戻る
            </Button>
          </Center>
        </VStack>
      </Flex>
    </Flex>
  );
}
