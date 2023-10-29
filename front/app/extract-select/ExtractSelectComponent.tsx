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
  import { useRouter } from "next/navigation";
  import { useEffect, useState } from "react";
  import axios from "axios";
import { request } from "http";
import Loading from "../loading/page";
  
  export default function Tryon() {
    const [selectBody, setSelectBody] = useState("");
    const [extractedchange, setExtractedchange] = useState(false);
    const [reviewImage, setReviewImage] = useState("");
    const router = useRouter();

    const select_extract_part = async (part: string) =>{

        try {
            setExtractedchange(true);
            await axios.post("http://localhost:5000/do_extract_image", {
                extractpart: part 
            }) ;
            router.push("/extract-result")
        }catch (error) {
            console.error("Error uploading images", error);
          }
    };

    const update_select = async (part: string) => {
        setSelectBody(part);
    }

    if(extractedchange) {
        return<Loading />;
    }



    return(
        <Box
        p={"4"}
        mb={"4"}
        borderRadius="md"
        minHeight="100vh">
            <Center>
            <Box 
            boxSize="200px">
                <Center>
                    <Image
                    src= "http://localhost:5000/static/extract_select_image.jpg"
                    alt="Upload Image"
                    sizes="100px"/>
                  <Center>
                    <Button
                      mt={2}
                      colorScheme="yellow"
                        onClick={() => select_extract_part(selectBody)}
                        position="absolute" bottom={270} left="50%" transform="translateX(-50%)"
                    >
                      取り出す
                    </Button>
                  </Center>


                  <Center>
                    <Box bg="yellow.200" borderRadius="md" p={4} mt={4} mb={4}
                    position={"absolute"} bottom={300} left="50%" transform="translateX(-50%)">
                    <FormControl>
                        <FormLabel>
                        <Text  fontSize="xl" fontWeight="bold" color="black.500">
                            どこを取り出す？
                        </Text>
                        </FormLabel>
                        <RadioGroup
                        value={selectBody}
                        onChange={update_select}
                        bg="white"
                        
                        >
                        <Stack direction="row" spacing={2} p={3}>
                            <Radio value="upper">上半身</Radio>
                            <Radio value="pants">下半身</Radio>
                            <Radio value="dress">ドレス</Radio>
                            <Radio value="scart">スカート</Radio>
                        </Stack>
                        </RadioGroup>
                    </FormControl>
                    </Box>
                </Center>

                </Center>

            </Box>
            </Center>
        </Box>
    );
  }
  