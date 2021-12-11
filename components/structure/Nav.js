import React, { Component, useState, useContext, useEffect } from "react";
import AppContext from '../../context/AppContext';
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

      <HStack p={5}>
        <Kali />
        <Spacer />
        <Account />
        <DarkModeSwitch />
        <Hamburger />
      </HStack>

  )
}
