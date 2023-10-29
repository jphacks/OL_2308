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

    const save_extract_part = async () =>{

        try {
            await axios.post("http://localhost:5000/save_extracted_image", {
            }) ;
            router.push("/search-favorite-view")
        }catch (error) {
            console.error("Error uploading images", error);
          }
    };

    const return_select_page = async () => {
        router.push("/search-favorite-view");
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
                    src= "http://localhost:5000/static/extracted_done_img.jpg"
                    alt="Upload Image"
                    sizes="100px"/>
                  <Center>
                    <Button
                      mt={2}
                      colorScheme="yellow"
                        onClick={() => save_extract_part()}
                        position="absolute" bottom={270} left="50%" transform="translateX(-50%)"
                    >
                      保存する
                    </Button>
                    <Button
                      mt={2}
                      colorScheme="yellow"
                        onClick={() => return_select_page()}
                        position="absolute" bottom={170} left="50%" transform="translateX(-50%)"
                    >
                      戻る
                    </Button>
                  </Center>

                </Center>

            </Box>
            </Center>
        </Box>
    );
  }
  