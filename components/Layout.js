import React from "react";
import {
  Container,
  ChakraProvider,
  Flex,
  Spinner,
  Center,
} from "@chakra-ui/react";
import Head from "next/head";
import Nav from "./Nav";
import LoadingIndicator from "./LoadingIndicator";
import Footer from "./Footer";

const Layout = (props) => {
  return (
    <>
      {props.loading == true ? <LoadingIndicator /> : ""}
      <Head>
        <title>KaliDAO</title>
        <meta
          property="og:title"
          content="optimized DAC protocol"
          key="title"
        />
      </Head>

      <Nav {...props} />
      <Container
        minheight="100vh"
        maxW="container.md"
        alignItems="center"
        justifyContent="center"
      >
        {props.children}
      </Container>
      <Footer />
    </>
  );
};
export default Layout;
