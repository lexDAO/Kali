import React, { Component, useState, useContext, useEffect } from "react";
import AppContext from '../context/AppContext';
import Link from "next/link";
import {
  Flex,
  Spacer,
  HStack,
} from "@chakra-ui/react";
import DarkModeSwitch from "./DarkModeSwitch";
import Hamburger from "./Hamburger";
import Kali from "./Kali";
import Account from "./Account";

export default function Nav() {
  const value = useContext(AppContext);
  const { account, chainId } = value.state;
  return(
    <Flex padding={5} width="100%">
      <Kali />
      <Spacer />
      <HStack>
        <Account />
        <DarkModeSwitch />
        <Hamburger />
      </HStack>
    </Flex>
  )
}
