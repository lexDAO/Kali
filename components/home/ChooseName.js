import React, { useState, useContext } from "react";
import AppContext from "../../context/AppContext";
import { Flex, VStack, Button, Text, Select, Input } from "@chakra-ui/react";
import { supportedChains } from "../../constants/supportedChains";
import { getNetworkName } from "../../utils/formatters";

export default function NameDAO(props) {
  const value = useContext(AppContext);
  const { web3, chainId, loading, account } = value.state;

  const changeDao = (e) => {
    let newValue = e.target.value;
    let array = props.details;
    array['daoName'] = newValue;
    props.setDetails(array);
    console.log(props.details)
  };

  const changeSymbol = (e) => {
    let newValue = e.target.value;
    let array = props.details;
    array['symbol'] = newValue;
    props.setDetails(array);
    console.log(props.details)
  };

  return (
    <VStack>
        <Text>Give your DAO a name and a symbol</Text>
        <Text>This is how your DAO token will appear in Etherscan and wallets</Text>
        <Text><b>Name</b></Text><Input defaultValue={props.details['daoName']} onChange={changeDao} />
        <Text><b>Symbol</b></Text><Input defaultValue={props.details['symbol']} onChange={changeSymbol} />

        <Button onClick={() => props.handleNext(2)}>Next</Button>

    </VStack>
  );
}
