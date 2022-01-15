import React, { Component, useState, useContext, useEffect } from "react";
import { BrowserView, MobileView, isBrowser } from "react-device-detect";
import AppContext from "../../context/AppContext";
import Link from "next/link";
import { Flex, Spacer, HStack } from "@chakra-ui/react";
import NavRightContainer from "./NavRightContainer";
import Hamburger from "./Hamburger";
import Kali from "./Kali";
import KaliMobile from "./KaliMobile";
import Account from "./Account";
import Chain from "./Chain";

export default function Nav() {
  const value = useContext(AppContext);
  const { account, chainId } = value.state;
  return (
    <HStack id="nav">
      {isBrowser == true ? <Kali /> : null}
      <Spacer />
      <NavRightContainer />
    </HStack>
  );
}
