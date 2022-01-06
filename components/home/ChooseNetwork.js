import React, { useState, useContext, useEffect } from "react";
import AppContext from "../../context/AppContext";
import { Flex, VStack, Button, Text, Select } from "@chakra-ui/react";
import { supportedChains } from "../../constants/supportedChains";
import { getNetworkName } from "../../utils/formatters";

export default function ChooseNetwork(props) {
  const value = useContext(AppContext);
  const { web3, chainId, loading, account } = value.state;
  const [network, setNetwork] = useState(999); // for visibility handling in this component

  useEffect(() => {
    if(props.details['network'] != null) {
      setNetwork(props.details['network']);
    }

  }, []);

  const updateNetwork = (e) => {
    let newValue = e.target.value;
    let array = props.details;
    array['network'] = newValue;
    setNetwork(newValue);
    props.setDetails(array);
    console.log(props.details)
  };

  return (
    <VStack>
        <Text>Select your blockchain</Text>
        <Select onChange={updateNetwork} defaultValue={props.details['network']}>
            <option value="999"></option>
          {supportedChains.map((item, index) => (
            <option key={index} value={item['chainId']}>{item['name']}</option>
          ))}
        </Select>
        {network != 999 && chainId != network ||  network != 999 && chainId != network && account == null ?
          <>
          <Text>Please connect your wallet to {getNetworkName(network)}.</Text>
          <Button onClick={value.connect}>Connect</Button>
          </>
        : network != 999 && chainId == network ?
          <>
          <Text><i>connected to {getNetworkName(network)}</i></Text>
          <Button onClick={() => props.handleNext(1)}>Next</Button>
          </>
        : null}
    </VStack>
  );
}
