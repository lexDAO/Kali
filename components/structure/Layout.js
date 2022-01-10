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
    <style jsx global>{`
      body {
        background: linear-gradient(90deg, #e65170, #3b074e);
        background: linear-gradient(90deg, #a0b1dc, #594cfb);
        min-height: 100vh
      }

        body:before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          right: 0;
          mask-image: linear-gradient(to bottom, transparent, black);
          background: linear-gradient(90deg, hotpink, rebeccapurple);
          z-index: -1
        }
    `}</style>
      {loading == true ? <LoadingIndicator /> : ""}
      <Head>
        <title>KaliDAO</title>
        <meta
          property="og:title"
          content="optimized DAC protocol"
          key="title"
        />
      </Head>

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
