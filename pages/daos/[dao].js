import React, { Component } from "react";
import { ChakraProvider, Container } from "@chakra-ui/react";
const abi = require("../../abi/KaliDAO.json");
import web3 from "../../eth/web3.js";
import Router, { useRouter } from "next/router";
import Layout from "../../components/Layout.js";
import Link from 'next/link';
import {
  chakra,
  Flex,
  Tab,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
  Stack,
  Box,
  Text,
  Spinner
} from "@chakra-ui/react";
import Proposals from "../../components/Proposals.js";
import ProposeMember from "../../components/ProposeMember.js";
import ProposeKickMember from "../../components/ProposeKickMember.js";
import ProposeCall from "../../components/ProposeCall.js";

class App extends Component {

  state = {
    loading: false,
    account: null
  };

  async componentDidMount() {
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];
    this.setState({ account });
  }

  static async getInitialProps({ query }) {
    // * dao params * //
    const address = query["dao"];
    const instance = new web3.eth.Contract(abi, address);
    const name = await instance.methods.name().call();
    const symbol = await instance.methods.symbol().call();
    const decimals = parseInt(await instance.methods.decimals().call());
    const totalSupply = parseInt(await instance.methods.totalSupply().call());
    const paused = await instance.methods.paused().call();
    const proposalCount = parseInt(
      await instance.methods.proposalCount().call()
    );
    const votingPeriod = parseInt(await instance.methods.votingPeriod().call());
    const quorum = parseInt(await instance.methods.quorum().call());
    const supermajority = parseInt(
      await instance.methods.supermajority().call()
    );

    const dao = {
      address,
      name,
      symbol,
      decimals,
      totalSupply,
      paused,
      proposalCount,
      votingPeriod,
      quorum,
      supermajority,
    };

    // * get proposals - will need to add more logic - maybe using block.timestamp * //
    const proposals = [];
    const proposalTypes = ["MINT", "BURN", "CALL", "PERIOD", "QUORUM", "SUPERMAJORITY", "PAUSE", "EXTENSION"];

    const cutoff = parseInt(Date.now() / 1000 - votingPeriod);
    for (var i = 0; i < proposalCount; i++) {
      var proposal = await instance.methods.proposals(i).call();
      var proposalArrays = await instance.methods.getProposalArrays(i).call();
      // * ignore empty proposals, as those are deleted ones * ///
      if (proposal["creationTime"] != 0) {
        // probably better way to handle at scale
        // * add human-readable proposal type * //
        let proposalType = parseInt(proposal["proposalType"]);
        proposal["type"] = proposalTypes[proposalType];
        // * check if voting still open * //
        if (parseInt(proposal["creationTime"]) > cutoff) {
          proposal["open"] = true;
        } else {
          proposal["open"] = false;
        }
        // integrate data from array getter function
        proposal["amount"] = proposalArrays["amount"];
        proposal["account"] = proposalArrays["account"];
        proposal["payload"] = proposalArrays["payload"];

        proposals.push(proposal);
      }
    }

    return { dao, proposals };
  }

  submitProposal = async (event) => {
    event.preventDefault();
    this.setState({ loading: true });
    console.log(this.state);
    let object = event.target;
    var array = [];
    for (let i = 0; i < object.length; i++) {
      array[object[i].name] = object[i].value;
    }

    var { dao, proposalType, description, account, amount, payload } = array;

    const instance = new web3.eth.Contract(abi, dao);

    if (proposalType == 1) {
      amount = await instance.methods.balanceOf(account).call();
    }

    // convert units to wei for mint proposals - this should be covered for burn per balanceOf
    if (proposalType == 0) {
      amount = web3.utils.toWei(amount);
    }

    const accounts = await web3.eth.getAccounts();

    try {
      let result = await instance.methods
        .propose(proposalType, description, [account], [amount], [payload])
        .send({ from: accounts[0] });

      Router.push({
        pathname: "/daos/[dao]",
        query: { dao: dao },
      });

    } catch (e) {
        alert(e);
        console.log(e);
    }
    this.setState({ loading: false });

  }

  vote = async () => {
    event.preventDefault();

    this.setState({ loading: true });

    let object = event.target;
    var array = [];
    for (let i = 0; i < object.length; i++) {
      array[object[i].name] = object[i].value;
    }

    const { dao, index, approval } = array;

    const instance = new web3.eth.Contract(abi, dao);

    const accounts = await web3.eth.getAccounts();
    // * first, see if they already voted * //
    const voted = await instance.methods.voted(index, accounts[0]).call();
    if (voted == true) {
      alert("You already voted");
    } else {
      let result = await instance.methods
        .vote(index, parseInt(approval))
        .send({ from: accounts[0] });
      console.log(result);
      this.setState({ loading: false });
      Router.push({
        pathname: "/daos",
        query: { dao: dao },
      });
    }
  }

  process = async () => {
    event.preventDefault();
    this.setState({ loading: true });
    let object = event.target;
    var array = [];
    for (let i = 0; i < object.length; i++) {
      array[object[i].name] = object[i].value;
    }

    const { dao, index } = array;

    const instance = new web3.eth.Contract(abi, dao);

    const accounts = await web3.eth.getAccounts();
    // * first, see if they already voted * //
    let result = await instance.methods
      .processProposal(index)
      .send({ from: accounts[0] });
    this.setState({ loading: false });
    Router.push({
      pathname: "/daos",
      query: { dao: dao },
    });
  }

  render() {
    console.log(web3.currentProvider);
    return (
      <Layout {...this.props} account={this.state.account} loading={this.state.loading}>
        <Stack spacing={5}>
          <Flex alignItems="center" justifyContent="center">
            <Text color="kali.800">
              {this.props.dao["name"]} \\ {this.props.dao["address"]}
            </Text>
          </Flex>

          <Box p={12} rounded={12}>
            <Text fontWeight="bold">Existing Proposals</Text>
            <Proposals
              {...this.props}
              vote={this.vote}
              process={this.process}
            />
          </Box>

          <Box
            bgGradient="linear(to-br, kali.200, kali.100)"
            padding={12}
            rounded={12}
          >
            <Text fontWeight="bold" color="kali.900">
              Submit a Proposal
            </Text>
            <Tabs color="kali.900">
              <TabList>
                <Tab>Mint</Tab>
                <Tab>Burn</Tab>
                <Tab>Call</Tab>
              </TabList>

              <TabPanels>
                <TabPanel>
                  <ProposeMember
                    {...this.props}
                    submitProposal={this.submitProposal}
                  />
                </TabPanel>
                <TabPanel>
                  <ProposeKickMember
                    {...this.props}
                    submitProposal={this.submitProposal}
                  />
                </TabPanel>
                <TabPanel>
                  <ProposeCall
                    {...this.props}
                    submitProposal={this.submitProposal}
                  />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>
        </Stack>
      </Layout>
    );
  }
}

export default App;
