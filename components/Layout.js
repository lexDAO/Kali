import React from "react";
import {
  Container,
  ChakraProvider,
  Flex,
  Spinner,
  Center,
} from "@chakra-ui/react";
import { extendTheme } from "@chakra-ui/react";
import Head from "next/head";
import Nav from "./Nav";

const Layout = (props) => {
  return (
    <>
      <Head>
        <title>KaliDAO</title>
        <meta
          property="og:title"
          content="optimized DAC protocol"
          key="title"
        />
      </Head>
      {props.loading == true ? (
        <Center
          position="absolute"
          width="100%"
          height="100%"
          backgroundColor="grey"
          opacity=".4"
        >
          <Spinner size="xl" />
        </Center>
      ) : (
        ""
      )}
      <Nav {...props} />
      <Container
        minheight="100vh"
        maxW="container.md"
        alignItems="center"
        justifyContent="center"
      >
        {props.children}
      </Container>
    </>
  );
};
export default Layout;
