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
  const [currentAccount, setCurrentAccount] = useState(null);

  const checkWalletConnected = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        console.log("Make sure you have MetaMask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);

        const accounts = await ethereum.request({ method: "eth_accounts" });

        if (accounts.length !== 0) {
          const account = accounts[0];
          console.log("Found an authorised account: ", account);
          setCurrentAccount(account);
        } else {
          console.log("No authorised account found");
        }
      }
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const renderFactory = () => {
    // TODO: render
    return <Factory />;
  };

  useEffect(() => {
    setLoading(true);
    checkWalletConnected();
  }, []);

  return (
    (<Layout />),
    (
      <>
        <Flex padding={5} width="100vw">
          <Box
            as="h1"
            letterSpacing="wide"
            fontWeight="extrabold"
            fontSize="4xl"
            bgGradient="linear(to-br, kali.900, kali.600)"
            bgClip="text"
            textShadow="2.4px 0.4px kali.900"
            ml={2}
          >
            KaliDAO
          </Box>
          <Spacer />
          <Button
            bgGradient="linear(to-br, kali.600, kali.700)"
            size="md"
            variant="ghost"
            mr={2}
            onClick={connectWallet}
          >
            {currentAccount == null ? "Connect Wallet" : currentAccount}
          </Button>
        </Flex>
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
            <Text as="p" fontWeight="semibold" fontsize="md">
              Kali is an optimised DAC protocol.
            </Text>
            <Button
              bgGradient="linear(to-br, kali.600, kali.700)"
              size="md"
              variant="ghost"
              onClick={renderFactory}
            >
              Create Kali DAO!
            </Button>
          </Container>
          <Container>{/*Fix Daos component. Display here.*/}</Container>
        </Flex>
        <Footer />
      </>
    )
  );
}
