/* eslint-disable react/no-children-prop */
import React, { Component } from "react";
import factory from "../eth/factory.js";
const abi = require("../abi/KaliDAO.json");
import web3 from "../eth/web3.js";
import Link from 'next/link';
import {
  Flex,
  Heading,
  Text
  } from "@chakra-ui/react";
import FlexOutline from "./FlexOutline";

class DaoInfo extends Component {

  render() {

    const dao = this.props.dao;

    return (
      <FlexOutline>
        <Text>Name: {dao['name']}</Text>
        <Text>Address: {dao['address']}</Text>
        <Text>Symbol: {dao['symbol']}</Text>
        <Text>Shares: {dao['totalSupply']}</Text>
        <Text>Paused: {dao['paused']}</Text>
        <Text>Voting period: {dao['votingPeriod']}</Text>
        <Text>Quorum: {dao['quorum']}</Text>
        <Text>Supermajority: {dao['supermajority']}</Text>
        <Text>Docs: <Link href={`${dao['docs']}`}>{dao['docs']}</Link></Text>
      </FlexOutline>
    );
  }
}

export default DaoInfo;
