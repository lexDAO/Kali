import React from "react";
import { Flex } from "@chakra-ui/react";

const FlexGradient = (props) => {
  return (
    <Flex
      display="flex"
      flexDirection="column"
      bgGradient="linear(to-br, kali.200, kali.100)"
      p={5}
      color="kali.900"
      fontSize="md"
      letterSpacing="wide"
      lineHeight="tight"
      boxShadow="xs"
      rounded="xl"
      mb={5}
    >
      {props.children}
    </Flex>
  );
};
export default FlexGradient;
