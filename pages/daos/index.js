/* eslint-disable react/no-children-prop */
import React, { Component } from "react";
import { ChakraProvider, Container } from "@chakra-ui/react";
import factory from "../../eth/factory.js";
import web3 from "../../eth/web3.js";
import Router, { useRouter } from "next/router";
import Layout from "../../components/Layout.js";
import Link from 'next/link';
import {
  Flex,
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
      let dao = events[i]['returnValues'];
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
          <Link href={`/daos/${e['kaliDAO']}`}>{e['kaliDAO']}</Link>
          </Flex>
        ))}
      </Layout>
    );
  }
}

export default Daos;
