/* eslint-disable react/no-children-prop */
import React, { Component } from "react";
import web3 from "../eth/web3.js";
import Router, { useRouter } from "next/router";
import Layout from "../components/Layout.js";
import {
  Button,
  Flex,
  Box,
  Text,
  Container,
  Spacer,
  VStack,
  Divider,
  Stack,
} from "@chakra-ui/react";
import Factory from "../components/Factory";
import factory from "../eth/factory.js";
const abi = require("../abi/KaliDAO.json");
import Daos from "../components/Daos";
import LoadingIndicator from "../components/LoadingIndicator";
import FlexGradient from "../components/FlexGradient";
import FactoryForm from "../components/FactoryForm.js";

class Home extends Component {
  state = {
    loading: false,
    factoryVisible: false,
  };

  toggleLoading = () => {
    this.setState({ loading: !this.state.loading });
  };

  toggleFactory = () => {
    this.setState({ factoryVisible: !this.state.factoryVisible });
  };

  static async getInitialProps() {
    const events = await factory.getPastEvents("DAOdeployed", {
      fromBlock: 0,
      toBlock: "latest",
    });
    const eventArray = [];
    for (let i = 0; i < events.length; i++) {
      const address = events[i]["returnValues"]["kaliDAO"];
      const instance = await new web3.eth.Contract(abi, address);
      const name = await instance.methods.name().call();
      const dao = { kaliDAO: address, name: name };
      eventArray.push(dao);
    }
    return { eventArray };
  }

  render() {
    return (
      <Layout loading={this.state.loading}>
        <Stack spacing={5}>
          <FlexGradient>
            <Stack spacing={5} p={5} alignItems="center">
              <Text
                fontSize="4xl"
                color="kali.700"
                fontWeight="bold"
                letterSpacing="wide"
              >
                KaliDAO
              </Text>
              <Text fontSize="xl">
                KaliDAO is an optimized DAC framework like you&apos;ve never
                seen before. Move over, Moloch: the queen has arrived.
              </Text>
              <Button onClick={this.toggleFactory}>Create KaliDAO</Button>
            </Stack>
          </FlexGradient>
          <Divider />
          <>
            {this.state.factoryVisible == true ? (
              <>
                <FactoryForm toggleLoading={this.toggleLoading} />
                <Divider />
              </>
            ) : (
              ""
            )}
          </>
          <Daos {...this.props} />
        </Stack>
      </Layout>
    );
  }
}

export default Home;
