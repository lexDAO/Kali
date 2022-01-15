import React, { useState, useContext } from "react";
import AppContext from "../../context/AppContext";
import { Flex, VStack, Button, Text, Select, Input, Heading } from "@chakra-ui/react";
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

  const errorCheck = () => {
    if(props.details['daoName']==null) {
      value.toast("Please choose a name.");
    }
    if(props.details['symbol'] == null) {
      value.toast("Please choose a symbol.");
    }
    if(props.details['daoName'] != null && props.details['symbol'] != null) {
      props.handleNext();
    }
  }

  return (
    <VStack>
        <Heading as="h1">Select a name and symbol:</Heading>
        <Text fontSize="xl"><b>Name</b></Text><Input defaultValue={props.details['daoName']} onChange={changeDao} />
        <Text fontSize="xl"><b>Symbol</b></Text><Input defaultValue={props.details['symbol']} onChange={changeSymbol} />

        <Button className="transparent-btn" onClick={() => errorCheck()}>Next »</Button>

    </VStack>
  );
}
