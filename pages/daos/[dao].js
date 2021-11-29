import React, { Component } from "react";
const abi = require("../../abi/KaliDAO.json");
import web3 from "../../eth/web3.js";
import Router, { useRouter } from "next/router";
import Layout from "../../components/Layout.js";
import {
  chakra,
  Flex,
  Tab,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
  Stack,
  Text,
} from "@chakra-ui/react";
import Proposals from "../../components/Proposals.js";
import NewProposal from "../../components/NewProposal.js";
import DaoInfo from "../../components/DaoInfo.js";

class App extends Component {
  state = {
    loading: false,
  };

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
    const docs = await instance.methods.docs().call();

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
      docs,
    };

    // * get proposals - will need to add more logic - maybe using block.timestamp * //
    const proposals = [];
    const proposalTypes = [
      "MINT",
      "BURN",
      "CALL",
      "PERIOD",
      "QUORUM",
      "SUPERMAJORITY",
      "PAUSE",
      "EXTENSION",
    ];
    const eventData = await instance.getPastEvents("NewProposal", {
      fromBlock: 0,
      toBlock: "latest",
    });

    const cutoff = Date.now() / 1000 - parseInt(votingPeriod);
    for (var i = 0; i < proposalCount; i++) {
      var proposal = await instance.methods.proposals(i).call();
      var proposalArrays = await instance.methods.getProposalArrays(i).call();
      // * ignore empty proposals, as those are deleted ones * ///
      if (parseInt(proposal["creationTime"]) != 0) {
        // probably better way to handle at scale
        // * add human-readable proposal type * //
        let proposalType = parseInt(proposal["proposalType"]);
        proposal["type"] = proposalTypes[proposalType];
        let expires = new Date(
          (parseInt(proposal["creationTime"]) + parseInt(votingPeriod)) * 1000
        );
        proposal["expires"] = expires.toLocaleString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "numeric",
        });
        // * check if voting still open * //
        if (parseInt(proposal["creationTime"]) > cutoff) {
          proposal["open"] = true;
          // time remaining
          proposal["timeRemaining"] = cutoff - Date.now() / 1000;
        } else {
          proposal["open"] = false;
          proposal["timeRemaining"] = 0;
        }
        // add id to array
        proposal["id"] = i;
        // integrate data from array getter function
        let amount = proposalArrays["amount"][0];
        proposal["amount"] = web3.utils.fromWei(amount, "ether");
        proposal["account"] = proposalArrays["account"];
        proposal["payload"] = proposalArrays["payload"];

        // format date for display
        let created = new Date(parseInt(proposal["creationTime"]) * 1000);
        proposal["created"] = created.toLocaleString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "numeric",
        });

        // get proposer
        for (let j = 0; j < eventData.length; j++) {
          if (eventData[j]["returnValues"]["proposal"] == i) {
            proposal["proposer"] = eventData[j]["returnValues"]["proposer"];
          }
        }

        proposals.push(proposal);
      }
    }

    // chain info
    const chains = {
      1: {
        name: "mainnet",
        explorer: "etherscan.io",
      },
      4: {
        name: "rinkeby",
        explorer: "https://rinkeby.etherscan.io/",
      },
      137: {
        name: "polygon",
        explorer: "https://polygonscan.com/",
      },
      42161: {
        name: "arbitrum",
        explorer: "https://arbiscan.io/",
      },
    };

    const chainInfo = {};
    const chainId = await web3.eth.getChainId();
    if (chains[chainId] != null) {
      chainInfo["explorer"] = chains[chainId]["explorer"];
      chainInfo["name"] = chains[chainId]["name"];
      chainInfo["chainId"] = chainId;
    }

    // get historical token holders
    const holders = await instance.getPastEvents("Transfer", {
      fromBlock: 0,
      toBlock: "latest",
    });
    const dupes = [];
    // list that contains duplicates
    for (let k = 0; k < holders.length; k++) {
      let holder = holders[k]["returnValues"]["to"];
      dupes[k] = holder;
    }
    // unique list of addresses
    const uniques = dupes.filter((v, i, a) => a.indexOf(v) === i);

    const holdersArray = [];
    for (let k = 0; k < uniques.length; k++) {
      let holder = uniques[k];
      let shares = await instance.methods.balanceOf(holder).call();
      if (shares > 0) {
        holdersArray.push([holder, shares]);
      }
    }

    return { dao, proposals, chainInfo, holdersArray };
  }

  toggleLoading = () => {
    this.setState({ loading: !this.state.loading });
  };

  render() {
    console.log(web3.currentProvider);
    return (
      <Layout
        {...this.props}
        account={this.state.account}
        loading={this.state.loading}
      >
        <Tabs colorScheme="kali">
          <TabList>
            <Tab>Proposals</Tab>
            <Tab>+ New Proposal</Tab>
            <Tab>DAO Info</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <Proposals {...this.props} toggleLoading={this.toggleLoading} />
            </TabPanel>

            <TabPanel>
              <NewProposal {...this.props} toggleLoading={this.toggleLoading} />
            </TabPanel>

            <TabPanel>
              <DaoInfo {...this.props} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Layout>
    );
  }
}

export default App;
