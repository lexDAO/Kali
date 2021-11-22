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

const theme = extendTheme({
  colors: {
    kali: {
      100: "#46254A", // american purple
      200: "#294A25", // pomona green
      300: "#34254A", // russian violet
      400: "#F4C824", // deep lemon
      500: "#F03B361", // rajah
      600: "#B82623", // firebrick
      700: "#F74D38", // ogre odor
      800: "#0c0101", // black
      900: "#fffefe", // white
    },
  },
});

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
