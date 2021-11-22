import React, { Component, Link } from "react";
import { Box, Flex, Button, Text, Spacer, VStack } from "@chakra-ui/react";

class Nav extends Component {
  render() {
    return (
      <Flex bgColor="kali.900" padding={5} marginBottom={10} width="100vw">
        <Box
          as="h1"
          letterSpacing="wide"
          fontWeight="extrabold"
          fontSize="4xl"
          bgGradient="linear(to-br, kali.600, kali.700)"
          bgClip="text"
          textShadow="2.4px 0.4px #000"
          ml={2}
        >
          KaliDAO
        </Box>
        <Spacer />
        <Button bg="kali.400" size="sm" mr={2}>
          {this.props.account == null ? "Connect Wallet" : this.props.account}
        </Button>
      </Flex>
    );
  }
}

export default Nav;
