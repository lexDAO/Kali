import React, { Component, useState, useContext, useEffect } from "react";
import {BrowserView, MobileView, isBrowser} from 'react-device-detect';
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
import KaliMobile from "./KaliMobile";
import Account from "./Account";

export default function Nav() {
  const value = useContext(AppContext);
  const { account, chainId } = value.state;
  return(

      <HStack p={5}>
        {isBrowser==true ?
        <Kali /> : null}
        <Spacer />
        <Account />
        <DarkModeSwitch />
        <Hamburger />
      </HStack>

  )
}
