import React, { useState, useContext } from "react";
import Router, { useRouter } from "next/router";
import AppContext from '../../context/AppContext';
import Link from "next/link";
import {
  Flex,
  Heading,
  Text,
  Icon,
  HStack,
  UnorderedList,
  ListItem,
} from "@chakra-ui/react";
import FlexGradient from "../elements/FlexGradient.js";

import { BsFillArrowUpRightSquareFill } from "react-icons/bs";

export default function DaoInfo(props) {
  const value = useContext(AppContext);
  const { web3, loading } = value.state;
  const router = useRouter();
  const { dao, address, holdersArray } = props;
  console.log(dao)
  return (
    <FlexGradient>
      <Text>Name: {dao["name"]}</Text>
      <HStack>
        <Text>Address: {dao["address"]}</Text>
        <Link
          passHref
          href={`https://rinkeby.etherscan.io/address/${dao["address"]}`}
        >
          <Icon as={BsFillArrowUpRightSquareFill} />
        </Link>
      </HStack>
      <Text>Symbol: {dao["symbol"]}</Text>
      <Text>Shares: {dao["totalSupply"] / 1000000000000000000} </Text>
      <Text>Members: {holdersArray.length}</Text>
      <Text>Transferable: {dao["paused"]}</Text>
      <Text>Voting period: {dao["votingPeriod"]} seconds</Text>
      <Text>Quorum: {dao["quorum"]}%</Text>
      <Text>Supermajority: {dao["supermajority"]}%</Text>
      <HStack>
        <Text isTruncated>Docs: {dao["docs"]}</Text>
        <Link href={`${dao["docs"]}`}>
          <Icon as={BsFillArrowUpRightSquareFill} />
        </Link>
      </HStack>
      <Text>Members:</Text>
      <UnorderedList>
        {holdersArray.map((h, index) => (
          <ListItem key={index}>
            {h[0]} ({web3.utils.fromWei(h[1])} shares)
          </ListItem>
        ))}
      </UnorderedList>
    </FlexGradient>
  );
}
