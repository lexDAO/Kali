import React, { useState, useContext, useEffect } from "react";
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
import Reload from "../elements/Reload.js";
import { BsFillArrowUpRightSquareFill } from "react-icons/bs";
import { convertVotingPeriod, fromDecimals } from "../../utils/formatters";
import { fetchDaoInfo } from "../../utils/fetchDaoInfo";
import { addresses } from "../../constants/addresses";
import { factoryInstance } from "../../eth/factory";

const proposalTypes = require("../../constants/params");

export default function DaoInfo() {
  const value = useContext(AppContext);
  const { web3, loading, account, abi, chainId, visibleView, dao, address } = value.state;

  const reloadDao = async() => {
    fetchData();
  }

  useEffect(() => {
    if(!address) {
      return;
    } else {
      if(!dao) {
        fetchData();
      }
    }
  }, [address]);

  async function fetchData() {
    if (!address) {
      return;
    } else {
      value.setLoading(true);

      const instance = new web3.eth.Contract(abi, address);

      const factory = factoryInstance(addresses[chainId]["factory"], web3);

      const { dao_ } = await fetchDaoInfo(
        instance,
        factory,
        address,
        web3,
        chainId,
        account
      );

      value.setDao(dao_);
      console.log(dao_);
      value.setLoading(false);
    }
  }

  return (
    <FlexGradient>
      {dao == null ? (
        "Loading . . ."
      ) : (
        <>
          <Reload reload={reloadDao} />
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
                {b["token"]} ({fromDecimals(b["balance"], 18)})
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
