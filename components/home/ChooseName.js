import React, { useState, useContext } from "react";
import AppContext from "../../context/AppContext";
import { Flex, VStack, Button, Text, Select, Input } from "@chakra-ui/react";
import { supportedChains } from "../../constants/supportedChains";
import { getNetworkName } from "../../utils/formatters";

export default function NameDAO(props) {
  const value = useContext(AppContext);
  const { web3, chainId, loading, account } = value.state;
  const [daoName, setDaoName] = useState(null); // for visibility handling in this component
  const [symbol, setSymbol] = useState(null); // for visibility handling in this component

  const changeDao = (e) => {
    let newValue = e.target.value;
    let array = props.details;
    array['daoName'] = newValue;
    setDaoName(newValue);
    props.setDetails(array);
    console.log(props.details)
  };

  const changeSymbol = (e) => {
    let newValue = e.target.value;
    let array = props.details;
    array['symbol'] = newValue;
    setSymbol(newValue);
    props.setDetails(array);
    console.log(props.details)
  };

  return (
    <VStack>
        <Text>Next, give your DAO token a name and a symbol.</Text>
        <Text>This is how your DAO token will appear in Etherscan and other third party token trackers. Once your DAO is deployed, this cannot be changed.</Text>
        <Text>DAO token name:</Text><Input value={daoName} onChange={changeDao} />
        <Text>Symbol:</Text><Input value={symbol} onChange={changeSymbol} />
        {daoName != null && symbol != null ?
          <Button onClick={() => props.handleNext(2)}>Next</Button>
        : null}
    </VStack>
  );
}
