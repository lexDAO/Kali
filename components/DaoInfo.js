/* eslint-disable react/no-children-prop */
import React, { Component } from "react";
import factory from "../eth/factory.js";
const abi = require("../abi/KaliDAO.json");
import web3 from "../eth/web3.js";
import Link from "next/link";
import { Flex, Heading, Text, Icon, Button } from "@chakra-ui/react";
import FlexGradient from "./FlexGradient.js";

import {
  BsFillArrowUpRightSquareFill
} from 'react-icons/bs';

class DaoInfo extends Component {
  render() {
    const { dao, chainInfo } = this.props;
    console.log(chainInfo["explorer"]);

    return (
      <FlexGradient>
        <Text>Name: {dao["name"]}</Text>
        <Button size="sm" rightIcon={<BsFillArrowUpRightSquareFill />}>
          <Link href={`${chainInfo["explorer"]}/address/${dao["address"]}`}><Text>View</Text></Link>
        </Button>
        <Text>Symbol: {dao["symbol"]}</Text>
        <Text>Shares: {dao["totalSupply"]}</Text>
        <Text>Transferable: {dao["paused"]}</Text>
        <Text>Voting period: {dao["votingPeriod"]}</Text>
        <Text>Quorum: {dao["quorum"]}</Text>
        <Text>Supermajority: {dao["supermajority"]}</Text>
        <Text>
          Docs: <Link href={`${dao["docs"]}`}>{dao["docs"]}</Link>
        </Text>
      </FlexGradient>
    );
  }
}

export default DaoInfo;
