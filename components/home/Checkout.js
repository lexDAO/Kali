import React, { useState, useContext } from "react";
import Router from "next/router";
import AppContext from "../../context/AppContext";
import {
  Flex,
  VStack,
  Button,
  Text,
  Select,
  List,
  ListItem,
} from "@chakra-ui/react";
import { supportedChains } from "../../constants/supportedChains";
import {
  getNetworkName,
  convertVotingPeriod,
  fromDecimals,
} from "../../utils/formatters";
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
      docs,
    } = props.details;

    const govSettings = Array(
      quorum,
      supermajority,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1
    );

    let extensionsArray;
    let extensionsData;

    if (extensions == null) {
      extensionsArray = new Array(0);
      extensionsData = new Array(0);
    } else {
      extensionsArray = [];
      extensionsData = [];

      if ("tribute" in extensions) {
        extensionsArray.push(addresses[chainId]["extensions"]["tribute"]);
        extensionsData.push("0x");
      }

      if ("crowdsale" in extensions) {
        extensionsArray.push(addresses[chainId]["extensions"]["crowdsale"]);

        var {
          listId,
          purchaseToken,
          purchaseMultiplier,
          purchaseLimit,
          saleEnds,
        } = extensions["crowdsale"];
        let now = parseInt(new Date().getTime() / 1000);
        saleEnds += now;

        const sale = require("../../abi/KaliDAOcrowdsale.json");

        const saleAddress = addresses[chainId]["extensions"]["crowdsale"];

        const saleContract = new web3.eth.Contract(sale, saleAddress);

        const encodedParams = web3.eth.abi.encodeParameters(
          ["uint256", "address", "uint8", "uint96", "uint32"],
          [listId, purchaseToken, purchaseMultiplier, purchaseLimit, saleEnds]
        );

        let payload = saleContract.methods
          .setExtension(encodedParams)
          .encodeABI();

        extensionsData.push(payload);
      }

      if ("redemption" in extensions) {
        extensionsArray.push(addresses[chainId]["extensions"]["redemption"]);

        var { redemptionStart, tokenArray } = extensions["redemption"];
        let now = parseInt(new Date().getTime() / 1000);
        redemptionStart += now;

        const redemption = require("../../abi/KaliDAOredemption.json");

        const redemptionAddress =
          addresses[chainId]["extensions"]["redemption"];

        const redemptionContract = new web3.eth.Contract(
          redemption,
          redemptionAddress
        );

        const encodedParams = web3.eth.abi.encodeParameters(
          ["address[]", "uint256"],
          [tokenArray, redemptionStart]
        );

        let payload = redemptionContract.methods
          .setExtension(encodedParams)
          .encodeABI();

        extensionsData.push(payload);
      }
    }

    console.log("extensionsArray", extensionsArray);
    console.log("extensionsData", extensionsData);

    console.log(
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
    );

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
  };

  return (
    <VStack>
      <Text>You have selected:</Text>
      <List>
        <ListItem>
          Chain <b>{details["network"]}</b>
        </ListItem>
        <ListItem>
          Name <b>{details["daoName"]}</b>
        </ListItem>
        <ListItem>
          Symbol <b>{details["symbol"]}</b>
        </ListItem>
        <ListItem>
          Type{" "}
          <b>
            {details["daoType"] == null
              ? "Custom"
              : presets[details["daoType"]]["type"]}
          </b>
        </ListItem>
        <ListItem>
          Members
          <List>
            <b>
              {details["members"].map((item, index) => (
                <ListItem key={index}>
                  {item} ({fromDecimals(details["shares"][index], 18)} shares)
                </ListItem>
              ))}
            </b>
          </List>
        </ListItem>
        <ListItem>
          Voting period <b>{convertVotingPeriod(details["votingPeriod"])}</b>
        </ListItem>
        <ListItem>
          Share transerability{" "}
          <b>{details["paused"] == 1 ? "restricted" : "unrestricted"}</b>
        </ListItem>
        <ListItem>
          Quorum <b>{details["quorum"]}%</b>
        </ListItem>
        <ListItem>
          Supermajority <b>{details["supermajority"]}%</b>
        </ListItem>
        <ListItem>
          Docs <b>{details["docs"] == "" ? "Ricardian" : details["docs"]}</b>
        </ListItem>
      </List>
      <Button onClick={deploy}>Deploy</Button>
    </VStack>
  );
}