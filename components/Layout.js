import React, { useState, useContext } from "react";
import AppContext from '../context/AppContext';
import {
  Container
} from "@chakra-ui/react";
import Head from "next/head";
import Nav from "./Nav";
import LoadingIndicator from "./Loading";
import Footer from "./Footer";

export default function Layout(props) {
  const value = useContext(AppContext);
  const { loading } = value.state;
  return(
    <>
      {loading == true ? <LoadingIndicator /> : ""}
      <Head>
        <title>KaliDAO</title>
        <meta
          property="og:title"
          content="optimized DAC protocol"
          key="title"
        />
      </Head>
      <Nav />
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
  )
}
