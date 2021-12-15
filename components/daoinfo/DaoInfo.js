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
import { convertVotingPeriod } from "../../utils/helpers";

export default function DaoInfo() {
  const value = useContext(AppContext);
  const { web3, loading, dao, address, holdersArray, balances } = value.state;
  const router = useRouter();

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
      <Text>Paused: {dao["paused"].toString()}</Text>
      <Text>Voting period: {convertVotingPeriod(dao['votingPeriod'])}</Text>
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
      <Text>Balances:</Text>
      <UnorderedList>
      {balances.map((b, index) => (
        <ListItem key={index}>
          {b['token']} ({web3.utils.fromWei(b['balance'])} shares)
        </ListItem>
      ))}
    </UnorderedList>
    <Text>Tribute: {dao['tribute'].toString()}</Text>
    </FlexGradient>
  );
}
