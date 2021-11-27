/* eslint-disable react/no-children-prop */
import React, { useState, useEffect } from "react";
import web3 from "../eth/web3.js";
import Router, { useRouter } from "next/router";
import Layout from "../components/Layout.js";
import Link from "next/link";
import { Button, Flex, Box, Text, Container, Spacer } from "@chakra-ui/react";
import Factory from "../components/Factory";
import LoadingIndicator from "../components/LoadingIndicator";
import Daos from "./daos/index";
import Footer from "../components/Footer";

export default function Home() {

  const [loading, setLoading] = useState(false);
  const [factoryVisible, setFactoryVisible] = useState(false);
  

  return (
    (
      <Layout>

        <Flex
          direction="row"
          justifyContent="center"
          alignItems="space-between"
          padding={6}
          m={3}
        >
          <Container>
            <Text
              as="h2"
              letterSpacing="wide"
              fontWeight="extrabold"
              fontSize="2xl"
            >
              Welcome!
            </Text>
            <Text as="p" fontWeight="semibold" fontSize="md">
              Kali is an optimised DAC protocol.
            </Text>
            <Button
              bgGradient="linear(to-br, kali.600, kali.700)"
              size="md"
              variant="ghost"
              onClick={() => setFactoryVisible(true)}
            >
              Create Kali DAO!
            </Button>
          </Container>
          <Container>
            {factoryVisible==true ? <Factory /> : null}
          </Container>
        </Flex>
        <Footer />
      </Layout>
    )
  );
}
