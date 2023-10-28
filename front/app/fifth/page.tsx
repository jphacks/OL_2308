"use client"

import {Box} from "@chakra-ui/react";
import { NextPage } from "next";

const Page: NextPage = () => {
  return (
    <Box width="100%" height="80vh" mt={4}>
      <iframe src="https://5-fifth.com/" width="100%" height="100%" />
    </Box>
  );
};

export default Page;