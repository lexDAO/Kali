import React, { useState, useContext } from "react";
import AppContext from "../../context/AppContext";
import { Container, HStack, Center, Spacer } from "@chakra-ui/react";
import Head from "next/head";
import NavRightContainer from "./NavRightContainer";
import Kali from "./Kali";
import KaliIcon from "../elements/KaliIcon";
import ActionMenu from "./ActionMenu";
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
      <div id="container-app">
      <HStack m={0}>
      <Container
        id="dao-sidebar"
        h="100vh"
        m={0}
        minH="100vh"
        minW='200px'
        maxW='300px'
        width={{sm: '200px', md: '250px', lg: '250px'}}
      >
          <Center><KaliIcon /></Center>
          <ActionMenu />
      </Container>
      <Container
        id="dao-main"
        h="100vh"
        minH="100vh"
        maxW="container.xl"
        alignItems="center"
        justifyContent="center"
      >
        <HStack id="nav"><Spacer /><NavRightContainer /></HStack>
        {props.children}
        <Footer />
      </Container>
      </HStack>
      </div>
    </>
  );
}
