import React, { useState, useContext } from "react";
import Router from "next/router";
import AppContext from "../../context/AppContext";
import { Flex, VStack, Button, Text, Select, List, ListItem, HStack, Stack, Spacer } from "@chakra-ui/react";
import { supportedChains } from "../../constants/supportedChains";
import { getNetworkName, convertVotingPeriod, fromDecimals } from "../../utils/formatters";
import { addresses } from "../../constants/addresses";
import { factoryInstance } from "../../eth/factory";
import { presets } from "../../constants/presets";
import DashedDivider from "../elements/DashedDivider";
import KaliButton from "../elements/KaliButton";

export default function Checkout(props) {
  const value = useContext(AppContext);
  const { web3, chainId, loading, account } = value.state;
  const details = props.details;

  // for use at the end
  let paused;
  if(details['paused']==1) {
    paused = "restricted";
  } else {
    paused = "unrestricted";
  }

  let daoType;
  if(details['daoType'] == null) {
    daoType = "Custom";
  } else {
    daoType = presets[details['daoType']]['type'];
  }

  let docs;
  if(details['docs']=="") {
    docs = "Ricardian";
  } else {
    docs = details['docs'];
  }

  const deploy = async () => {
    if (!web3 || web3 == null) {
      value.toast(errorMessages["connect"]);
      return;
    }
    value.setLoading(true);

    let factory;
    try {
      factory = factoryInstance(addresses[chainId]["factory"], web3);
    } catch (e) {
      value.toast(e);
    }

    var {
        network,
        daoName,
        symbol,
        members,
        shares,
        votingPeriod,
        paused,
        quorum,
        supermajority,
        extensions,
        docs
    } = props.details;

    const govSettings = Array(quorum, supermajority, 1,1,1,1,1,1,1,1,1,1,1);

    let extensionsArray;
    let extensionsData;

    if(extensions == null) {
      extensionsArray = new Array(0);
      extensionsData = new Array(0);
    } else {

      extensionsArray = [];
      extensionsData = [];

      if('tribute' in extensions) {
        extensionsArray.push(addresses[chainId]['extensions']['tribute']);
        extensionsData.push("0x");
      }

      if('crowdsale' in extensions) {
        extensionsArray.push(addresses[chainId]['extensions']['crowdsale']);

        var { listId, purchaseToken, purchaseMultiplier, purchaseLimit, saleEnds } = extensions['crowdsale'];
        let now = parseInt(new Date().getTime() / 1000);
        saleEnds += now;
        const payload = web3.eth.abi.encodeParameters(
          ["uint256", "address", "uint8", "uint96", "uint32"],
          [
            listId,
            purchaseToken,
            purchaseMultiplier,
            purchaseLimit,
            saleEnds,
          ]
        );
        extensionsData.push(payload);
      }

      if('redemption' in extensions) {
        extensionsArray.push(addresses[chainId]['extensions']['redemption']);

        var { redemptionStart, tokenArray } = extensions['redemption'];
        let now = parseInt(new Date().getTime() / 1000);
        redemptionStart += now;
        const payload = web3.eth.abi.encodeParameters(
          ["address[]", "uint256"],
          [tokenArray, redemptionStart]
        );
        extensionsData.push(payload);
      }

    }

    console.log("extensionsArray", extensionsArray);
    console.log("extensionsData", extensionsData);

    console.log("form", daoName, symbol, docs, paused, extensionsArray, extensionsData, members, shares, votingPeriod, govSettings);

    try {
      let result = await factory.methods
        .deployKaliDAO(
          daoName,
          symbol,
          docs,
          paused,
          extensionsArray,
          extensionsData,
          members,
          shares,
          votingPeriod,
          govSettings
        )
        .send({ from: account });

      let dao = result["events"]["DAOdeployed"]["returnValues"]["kaliDAO"];
      console.log(dao);
      console.log(result);

      Router.push({
        pathname: "/daos/[dao]",
        query: { dao: dao },
      });
    } catch (e) {
      value.toast(e);
      console.log(e);
    }

    value.setLoading(false);
  }

  const checkoutDetails = [
    {
      name: "Chain",
      details: details['network']
    },
    {
      name: "Name",
      details: details['daoName']
    },
    {
      name: "Symbol",
      details: details['symbol']
    },
    {
      name: "Type",
      details: daoType
    },
    {
      name: "Members",
      details: details['members']
    },
    {
      name: "Voting period",
      details: convertVotingPeriod(details['votingPeriod'])
    },
    {
      name: "Share transferability",
      details: paused
    },
    {
      name: "Quorum",
      details: details['quorum'] + "%"
    },
    {
      name: "Supermajority",
      details: details['supermajority'] + "%"
    },
    {
      name: "Docs",
      details: docs
    },
  ];

  return (
    <>
    <Stack id="checkout">
      {checkoutDetails.map((item, index) => (
        <>
          {Array.isArray(item.details) ? // members array
            <>
            <Text>{item.name}</Text>
            <List>
            {item.details.map((member, i) => (
              <ListItem>{member} ({fromDecimals(details.shares[i], 18)} shares)</ListItem>
            ))
            }
            </List>
            </>
          :
          <HStack>
            <Text>{item.name}</Text><Spacer /><Text>{item.details}</Text>
          </HStack>
          }
        <DashedDivider />
        </>
      ))}
    </Stack>
    <KaliButton id="deploy-btn" onClick={deploy}>Deploy Your DAO!</KaliButton>
    </>
  );
}
