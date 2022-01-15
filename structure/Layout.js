import React, { useState, useContext } from "react";
import AppContext from "../../context/AppContext";
import { Container } from "@chakra-ui/react";
import Head from "next/head";
import Nav from "./Nav";
import LoadingIndicator from "./Loading";
import Footer from "./Footer";

export default function Layout(props) {
  const value = useContext(AppContext);
  const { loading } = value.state;
  return (
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
      <div id="combined-gradient1"></div>
      <div id="combined-gradient2"></div>
      <div id="container-deployer">

      <Nav />
      <Container
        minH="70vh"
        maxW="container.lg"
        alignItems="center"
        justifyContent="center"
      >
        <div id="content">
        {props.children}
        </div>
      </Container>
      <Footer />
      </div>
    </>
  );
}
