/* eslint-disable @next/next/link-passhref */
/* eslint-disable react/no-children-prop */
import React, { Component } from "react";
import factory from "../eth/factory.js";
const abi = require("../abi/KaliDAO.json");
import web3 from "../eth/web3.js";
import Link from "next/link";
import {
  Button,
  Flex,
  Heading,
  Text,
  Icon,
  HStack,
  VStack,
  Divider,
  UnorderedList,
  ListItem,
} from "@chakra-ui/react";
import FlexGradient from "./FlexGradient.js";
import TokenForm from "./TokenForm.js"
import NftForm from './NftForm.js'

import { BsFillArrowUpRightSquareFill } from "react-icons/bs";

class DaoInfo extends Component {
  state = {
    loading: false,
    tokenVisible: false,
    nftVisible: false,
  }

  toggleLoading = () => {
    this.setState({ loading: !this.state.loading })
  }

  toggleTokenCreation = () => {
    this.setState({ tokenVisible: !this.state.tokenVisible })
    console.log("Toggle ERC20 Form: ", this.state.tokenVisible)
  }

  toggleNftCreation = () => {
    this.setState({ nftVisible: !this.state.nftVisible })
    console.log("Toggle ERC721 Form: ", this.state.tokenVisible)
  }

  render() {
    const { dao, chainInfo, holdersArray } = this.props

    return (
      <FlexGradient>
        <Text>Name: {dao["name"]}</Text>
        <HStack>
          <Text>Address: {dao["address"]}</Text>
          <Link
            passHref
            href={`${chainInfo["explorer"]}/address/${dao["address"]}`}
          >
            <Icon as={BsFillArrowUpRightSquareFill} />
          </Link>
        </HStack>
        <Text>Symbol: {dao["symbol"]}</Text>
        <Text>Shares: {dao["totalSupply"] / 1000000000000000000} </Text>
        <Text>Members: {holdersArray.length}</Text>
        <Text>Transferable: {dao["paused"].toString()}</Text>
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
            <ListItem key={holdersArray.index}>
              {h[0]} ({web3.utils.fromWei(h[1])} shares)
            </ListItem>
          ))}
        </UnorderedList>
        <br />
        <Divider />
        <br />
        <HStack>
          <Button onClick={this.toggleTokenCreation}>Create ERC20</Button>
          <Button onClick={this.toggleNftCreation}>Create ERC721</Button>
        </HStack>
        <>
          {this.state.tokenVisible == true ? (
            <>
              <TokenForm
                toggleLoading={this.toggleLoading}
                dao={dao["address"]}
              />
              <Divider />
            </>
          ) : (
            ""
          )}
        </>
        <>
          {this.state.nftVisible == true ? (
            <>
              <NftForm
                toggleLoading={this.toggleLoading}
                dao={dao["address"]}
              />
              <Divider />
            </>
          ) : (
            ""
          )}
        </>
      </FlexGradient>
    )
  }
}

export default DaoInfo;
