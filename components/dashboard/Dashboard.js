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
  Grid,
  Box,
  Divider,
  Spacer,
} from "@chakra-ui/react";
import FlexGradient from "../elements/FlexGradient.js";
import Reload from "../elements/Reload.js";
import { BiGridAlt } from "react-icons/bi";
import { convertVotingPeriod, fromDecimals } from "../../utils/formatters";
import { fetchDaoInfo } from "../../utils/fetchDaoInfo";
import { addresses } from "../../constants/addresses";
import { factoryInstance } from "../../eth/factory";
import { dashboardHelper } from "../../constants/dashboardHelper";
import { correctNetwork } from "../../utils/network";

const proposalTypes = require("../../constants/params");

export default function Dashboard() {
  const value = useContext(AppContext);
  const {
    web3,
    loading,
    account,
    abi,
    chainId,
    visibleView,
    dao,
    address,
    daoChain,
  } = value.state;

  const reloadDao = async () => {
    fetchData();
  };

  useEffect(() => {
    if (!dao) {
      fetchData();
    }
  }, [chainId]);

  async function fetchData() {
    value.setLoading(true);

    try {
      const instance = new web3.eth.Contract(abi, address);

      const factory = factoryInstance(addresses[daoChain]["factory"], web3);

      const { dao_ } = await fetchDaoInfo(
        instance,
        factory,
        address,
        web3,
        daoChain,
        account
      );

      value.setDao(dao_);
      console.log(dao_);
      value.setLoading(false);
    } catch (e) {
      value.toast(e);
      value.setLoading(false);
    }
  }

  return (
    <div id="dashboard">
    <HStack>
      <Icon as={BiGridAlt} w={10} h={10} color="#5a2686" />
      <Heading as="h1">Dashboard</Heading>
    </HStack>
    <HStack>
      <Spacer />
      <Reload reload={reloadDao} />
    </HStack>
      <Grid
        gap={5}
        templateColumns={{
          sm: "repeat(1, 1fr)",
          md: "repeat(1, 1fr)",
          lg: "repeat(2, 1fr)",
        }}
      >
        {dao == null || web3 == undefined ? (
          "Loading . . ."
        ) : (
          <>
            {Object.entries(dashboardHelper).map(([k, v]) =>
              dashboardHelper[k]["check"] != null &&
              dao[dashboardHelper[k]["check"]] == null ? null : (
                <div className="gradient-item dashboard-tile">
                <Box
                  key={`component-${k}`}
                >
                  <Heading>{dashboardHelper[k]["title"]}</Heading>
                  {dashboardHelper[k]["component"]}
                </Box>
                </div>
              )
            )}
          </>
        )}
      </Grid>
    </div>
  );
}
