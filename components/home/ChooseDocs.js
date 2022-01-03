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
      name: "Code of Conduct Template",
      url: "https://github.com/lexDAO/LexCorpus/blob/master/contracts/legal/dao/membership/CodeOfConduct.md"
    },
    {
      name: "Trustless Unincorporated Nonprofit Association Agreement",
      url: "https://github.com/lexDAO/LexCorpus/blob/master/contracts/legal/dao/membership/TUNAA.md",
    },
    {
      name: "Delaware LLC Operating Agreement",
      url: "https://github.com/lexDAO/LexCorpus/blob/master/contracts/legal/dao/membership/operating/DelawareOperatingAgreement.md"
    }
  ];

  return (
    <VStack>
        <Text>Choose a legal form for your DAO.</Text>
        <Text>(Don&apos;t worry - you can update this later through proposal!)</Text>
        <Select onChange={handleSelect} defaultValue={props.details['docType']}>
          <option value="999"></option>
          <option value="0">I need an LLC, make one for me*</option>
          <option value="1">I have created a legal entity for the DAO, and the link to its governance documents is:</option>
          <option value="2">None</option>
        </Select>
        {selectedType==1 ? <Input defaultValue={props.details['docs']} onChange={handleChange} /> : null}
        {selectedType==0 ? <Text>*Your DAO will be issued a series of KaliDAO, LLC, a Delaware Series LLC. Click here to learn more about series LLCs, and if it&apos;s right for you. (coming soon)</Text> : null}
        <Text>Need a form for your DAO&apos;s governance documents?  Check out our templates. (Link to page in hamburger menu?)</Text>
        {selectedType != 999 ? <Button onClick={() => props.handleNext(6)}>Next</Button> : null}
    </VStack>
  );
}
