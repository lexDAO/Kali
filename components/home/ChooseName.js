import React, { useState, useContext, useEffect } from "react";
import AppContext from "../../context/AppContext";
import { Flex, VStack, Button, Text, Select, Input, Heading } from "@chakra-ui/react";
import { supportedChains } from "../../constants/supportedChains";
import { getNetworkName } from "../../utils/formatters";
import { factoryInstance } from "../../eth/factory";
import { fetchDaoNames } from "../../utils/fetchDaoNames";
import { addresses } from "../../constants/addresses";

export default function NameDAO(props) {
  const value = useContext(AppContext);
  const { web3, chainId, loading, account } = value.state;
  const [daoNames, setDaoNames] = useState(null);

  useEffect(() => {
    getDaoNames();
  }, []);

  const getDaoNames = async() => {
    try {
      let factory = factoryInstance(addresses[chainId]["factory"], web3);
      let daoNames_ = await fetchDaoNames(factory);
      setDaoNames(daoNames_);
      console.log(daoNames_)
    } catch (e) {
      value.toast(e);
    }
  }

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
    var error = 0;
    if(props.details['daoName']==null) {
      value.toast("Please choose a name.");
      error++;
    }
    if(daoNames.includes(props.details['daoName'])) {
      value.toast("This name is already taken. Please choose another name.");
      error++;
    }
    if(props.details['symbol'] == null) {
      value.toast("Please choose a symbol.");
      error++;
    }

    if(error == 0) {
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
