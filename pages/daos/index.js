/* eslint-disable react/no-children-prop */
import React, { Component } from "react";
import { ChakraProvider, Container } from "@chakra-ui/react";
import factory from "../../eth/factory.js";
const abi = require("../../abi/KaliDAO.json");
import web3 from "../../eth/web3.js";
import Router, { useRouter } from "next/router";
import Layout from "../../components/Layout.js";
import Link from 'next/link';
import {
  Flex,
  Heading,
  Text
  } from "@chakra-ui/react";

class Daos extends Component {
  state = {
    loading: false,
    account: null,
  };

  async componentDidMount() {
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];
    this.setState({ account });
  }

  static async getInitialProps() {
    const events = await factory.getPastEvents('DAOdeployed', {fromBlock: 0, toBlock: 'latest'});
    const eventArray = [];
    for(let i=0; i < events.length; i++) {
      const address = events[i]['returnValues']['kaliDAO'];
      const instance = await new web3.eth.Contract(abi, address);
      const name = await instance.methods.name().call();
      const dao = { kaliDAO: address, name: name };
      eventArray.push(dao);
    }
    return { eventArray };
  }

  render() {

    const eventArray = this.props.eventArray;

    return (
      <Layout loading={this.state.loading}>
        {eventArray.map((e, index) => (
          <Flex
            display="flex"
            flexDirection="column"
            bgGradient="linear(to-br, kali.200, kali.100)"
            p={5}
            color="kali.900"
            fontSize="md"
            letterSpacing="wide"
            lineHeight="tight"
            boxShadow="xs"
            rounded="xl"
            mb={5}
          >
            <Link href={`/daos/${e['kaliDAO']}`}>
              <Text>{e['name']}</Text>
            </Link>
            <Text>{e['kaliDAO']}</Text>
          </Flex>
        ))}
      </Layout>
    );
  }
}

export default Daos;
