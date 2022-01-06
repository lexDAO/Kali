import React, { useState, useContext, useEffect } from "react";
import AppContext from "../../context/AppContext";
import { Flex, VStack, Button, Text, List, ListItem, Select, Input } from "@chakra-ui/react";
import { supportedChains } from "../../constants/supportedChains";
import { getNetworkName } from "../../utils/formatters";
import { presets } from "../../constants/presets";
import { extensionDescriptions } from "../../constants/extensionsHelper";

export default function ChooseDocs(props) {
  const value = useContext(AppContext);
  const { web3, chainId, loading, account } = value.state;
  const [selectedType, setSelectedType] = useState(999);

  useEffect(() => {
    if(props.details['docType']!= null) {
      setSelectedType(props.details['docType']);
    }

  }, []);

  const handleSelect = (e) => {
    let type = e.target.value;
    let array = props.details;
    array["docType"] = type;
    if(type == 0) {
      array['docs'] = "";
    }
    if(type == 2) {
      array['docs'] = "none";
    }
    setSelectedType(type);
    props.setDetails(array);
  }

  const handleChange = (e) => {
    let array = props.details;
    array['docs'] = e.target.value;
    props.setDetails(array);
    console.log(props.details)
  }

  const templateOptions = () => [
    {
      name: "DAO Charter",
      url: "https://github.com/lexDAO/Kali/blob/main/legal/formation/Charter.md"
    },
    {
      name: "Trustless Unincorporated Nonprofit Association Agreement",
      url: "https://github.com/lexDAO/Kali/blob/main/legal/formation/una/TUNAA.md",
    },
    {
      name: "Delaware LLC Operating Agreement",
      url: "https://github.com/lexDAO/Kali/blob/main/legal/formation/llc/DelawareOA.md"
    }
  ];

  return (
    <VStack>
        <Text fontSize="xl"><b>Add a legal structure</b></Text>
        <Select onChange={handleSelect} defaultValue={props.details['docType']}>
          <option value="999"></option>
          <option value="0">Form an LLC</option>
          <option value="1">Use your own docs</option>
          <option value="2">None</option>
        </Select>
        {selectedType==1 ? <Input defaultValue={props.details['docs']} onChange={handleChange} /> : null}
        {selectedType==0 ? <Text><i>Your DAO will be issued a series NFT under KaliCo Ricardian LLC, a Delaware Series LLC. Click <a href="https://ricardian.gitbook.io/ricardian-llc/">here</a> to learn more.</i></Text> : null}
        {selectedType != 999 ? <Button onClick={() => props.handleNext(6)}>Next</Button> : null}
    </VStack>
  );
}
