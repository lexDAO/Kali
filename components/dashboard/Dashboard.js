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
} from "@chakra-ui/react";
import FlexGradient from "../elements/FlexGradient.js";
import Reload from "../elements/Reload.js";
import { convertVotingPeriod, fromDecimals } from "../../utils/formatters";
import { fetchDaoInfo } from "../../utils/fetchDaoInfo";
import { addresses } from "../../constants/addresses";
import { factoryInstance } from "../../eth/factory";
import { dashboardHelper } from "../../constants/dashboardHelper";
import { correctNetwork } from "../../utils/network";

const proposalTypes = require("../../constants/params");

export default function Dashboard() {
  const value = useContext(AppContext);
  const { web3, loading, account, abi, chainId, visibleView, dao, address, daoChain } =
    value.state;

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
    <>
    <Reload reload={reloadDao} />
    <Grid
      gap={5}
      templateColumns={{
        sm: "repeat(1, 1fr)",
        md: "repeat(2, 1fr)",
        lg: "repeat(2, 1fr)",
      }}>
      {dao == null || web3 == undefined ? (
        "Loading . . ."
      ) : (
        <>
          {Object.entries(dashboardHelper).map(([k, v]) => (
            dashboardHelper[k]["check"] != null && dao[dashboardHelper[k]["check"]] == null ? null :
            <Box
              key={`component-${k}`}
              p={5}
              w="450px"
              border="1px solid"
              border="1px solid"
              rounded="xl"
              borderColor="black"
              padding="25px"
              margin="5px"
            >
              <Text fontSize="xl">
                <b>{dashboardHelper[k]["title"]}</b>
              </Text>
              {dashboardHelper[k]["component"]}
            </Box>
          ))}
        </>
      )}
    </Grid>
    </>
  );
}
