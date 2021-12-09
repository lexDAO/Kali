import React from "react";
import { Flex } from "@chakra-ui/react";

const FlexOutline = (props) => {
  return (
    <Flex
      display="flex"
      flexDirection="column"
      //backgroundColor="black"
      border="1px"
      //borderColor="white"
      p={5}
      //color="white"
      boxShadow="xs"
      rounded="xl"
      mb={5}
      //maxW="90vw"
    >
      {props.children}
    </Flex>
  );
};
export default FlexOutline;
