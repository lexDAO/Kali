import React, { useState, useContext } from "react";
import Router from "next/router";
import AppContext from "../../context/AppContext";
import { Flex, VStack, Button, Text, Select, List, ListItem } from "@chakra-ui/react";
import { supportedChains } from "../../constants/supportedChains";
import { getNetworkName, convertVotingPeriod, fromDecimals } from "../../utils/formatters";
import { addresses } from "../../constants/addresses";
import { factoryInstance } from "../../eth/factory";
import { presets } from "../../constants/presets";

export default function Checkout(props) {
  const value = useContext(AppContext);
  const { web3, chainId, loading, account } = value.state;
  const details = props.details;

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

    const {
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
            purchaseLimit.toString(), // to prevent BigNumber errors
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

    console.log(daoName, symbol, docs, paused, extensionsArray, extensionsData, members, shares, votingPeriod, govSettings);

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

  return (
    <VStack>
      <Text>You have selected:</Text>
      <List>
          <ListItem>Chain: {details['network']}</ListItem>
          <ListItem>Name: {details['daoName']}</ListItem>
          <ListItem>Symbol: {details['symbol']}</ListItem>
          <ListItem>Type:
            {details['daoType'] == null ? "Custom" : presets[details['daoType']]['type']}
          </ListItem>
          <ListItem>Members:
            <List>
              {details['members'].map((item, index) => (
                <ListItem key={index}>{item} ({fromDecimals(details['shares'][index], 18)} shares)</ListItem>
              ))}
            </List>
          </ListItem>
          <ListItem>Voting period: {convertVotingPeriod(details['votingPeriod'])}</ListItem>
          <ListItem>Share transfer: {details['paused']==1 ? "paused" : "unrestricted"}</ListItem>
          <ListItem>Quorum: {details['quorum']}%</ListItem>
          <ListItem>Supermajority: {details['supermajority']}%</ListItem>
          <ListItem>Docs: {details['docs']=="" ? "Ricardian" : details['docs']}</ListItem>
      </List>
      <Button onClick={deploy}>Deploy my DAO!</Button>
    </VStack>
  );
}
