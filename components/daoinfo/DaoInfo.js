import React, { useState, useContext } from "react";
import Router, { useRouter } from "next/router";
import AppContext from "../../context/AppContext";
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
import { convertVotingPeriod } from "../../utils/formatters";

export default function DaoInfo() {
  const value = useContext(AppContext);
  const { web3, loading, dao, address } = value.state;
  const router = useRouter();

  return (
    <FlexGradient>
      {dao == null ? (
        "Loading . . ."
      ) : (
        <>
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
          <Text>Symbol: {dao["token"]["symbol"]}</Text>
          <Text>
            Shares: {dao["token"]["totalSupply"] / 1000000000000000000}{" "}
          </Text>
          <Text>Paused: {dao["token"]["paused"].toString()}</Text>
          <Text>
            Voting period: {convertVotingPeriod(dao["gov"]["votingPeriod"])}
          </Text>
          <Text>Quorum: {dao["gov"]["quorum"]}%</Text>
          <Text>Supermajority: {dao["gov"]["supermajority"]}%</Text>
          <HStack>
            <Text isTruncated>Docs: {dao["docs"]}</Text>
            <Link href={`${dao["docs"]}`}>
              <Icon as={BsFillArrowUpRightSquareFill} />
            </Link>
          </HStack>
          <Text>Members: {dao["members"].length}</Text>
          <Text>Balances:</Text>
          <UnorderedList>
            {dao["balances"].map((b, index) => (
              <ListItem key={index}>
                {b["token"]} ({web3.utils.fromWei(b["balance"])})
              </ListItem>
            ))}
          </UnorderedList>
          <Text>Extensions</Text>
          <UnorderedList>
            {dao["extensions"].map((e, index) => (
              <ListItem key={index}>{e}</ListItem>
            ))}
          </UnorderedList>
        </>
      )}
    </FlexGradient>
  );
}
