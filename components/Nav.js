import React, { Component, useState, useEffect } from "react";
import Link from "next/link";
import {
  Box,
  Flex,
  Button,
  Text,
  Spacer,
  VStack,
  HStack,
} from "@chakra-ui/react";
import web3 from "../eth/web3.js";

export default function Nav() {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [chainId, setChainId] = useState(null);

  // * begin check wallet connected * //

  useEffect(() => {
    checkWalletConnected();

    if (window.ethereum) {
      setChainId(window.ethereum.networkVersion);

      ethereum.on("accountsChanged", function (accounts) {
        checkWalletConnected();
        console.log("changed!");
      });
      window.ethereum.on("chainChanged", () => {
        window.location.reload();
      });
    }
  }, []);

  const checkWalletConnected = async () => {
    if (window.ethereum) {
      console.log("MetaMask is installed!");
      console.log(window.ethereum.networkVersion);
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });

        if (accounts.length !== 0) {
          const account = ethereum.selectedAddress;
          console.log("Found an authorised account: ", account);
          setCurrentAccount(account);
        } else {
          console.log("No authorised account found");
          return;
        }
      } catch (error) {
        if (error.code === 4001) {
          console.log("Metamask Connection Cancelled");
        }
      }
    } else {
      console.log("Make sure you have MetaMask!");
    }
  };

  // * end check wallet connected * //

  const connectWallet = async () => {
    window.location.reload();
  };

  return (
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
        <Link href="/">KaliDAO</Link>
      </Box>

      <Spacer />

      <VStack>
        <Button
          bgGradient="linear(to-br, kali.600, kali.700)"
          size="md"
          variant="ghost"
          color="white"
          mr={2}
          border={0}
          onClick={connectWallet}
        >
          {currentAccount == null ? "Connect Wallet" : currentAccount}
        </Button>
        {chainId == 4 ? (
          <Text>connected to Rinkeby</Text>
        ) : (
          <Text>please connect to Rinkeby</Text>
        )}
      </VStack>
    </Flex>
  );
}
