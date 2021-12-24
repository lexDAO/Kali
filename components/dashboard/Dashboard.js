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

const proposalTypes = require("../../constants/params");

export default function Dashboard() {
  const value = useContext(AppContext);
  const { web3, loading, account, abi, chainId, visibleView, dao, address } =
    value.state;

  const reloadDao = async () => {
    fetchData();
  };

  useEffect(() => {
    if (!address) {
      return;
    } else {
      if (!dao) {
        fetchData();
      }
    }
  }, [address]);

  async function fetchData() {
    if (!address) {
      return;
    } else {
      value.setLoading(true);
      try {
        const instance = new web3.eth.Contract(abi, address);

        const factory = factoryInstance(addresses[chainId]["factory"], web3);

        const { dao_ } = await fetchDaoInfo(
          instance,
          factory,
          address,
          web3,
          chainId,
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
  }

  return (
    <Grid>
      {dao == null ? (
        "Loading . . ."
      ) : (
        <>
          <Reload reload={reloadDao} />
          <Divider />
          {Object.entries(dashboardHelper).map(([k, v]) => (
            <Box
              key={`component-${k}`}
              p={5}
              w="100%"
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
  );
}
