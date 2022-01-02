import React, { useState, useContext } from "react";
import AppContext from "../../context/AppContext";
import { Flex, VStack, Button, Text, List, ListItem, Select, Input } from "@chakra-ui/react";
import { supportedChains } from "../../constants/supportedChains";
import { getNetworkName } from "../../utils/formatters";
import { presets } from "../../constants/presets";
import { extensionDescriptions } from "../../constants/extensionsHelper";

export default function ChooseDocs(props) {
  const value = useContext(AppContext);
  const { web3, chainId, loading, account } = value.state;
  const [docType, setDocType] = useState(999);
  const [docs, setDocs] = useState(null); // for visibility handling in this component

  const handleSelect = (e) => {
    let type = e.target.value;
    setDocType(type);
    let array = props.details;
    if(type == 0) {
      array['docs'] = "";
    }
    if(type == 2) {
      array['docs'] = "none";
    }
    props.setDetails(array);
    console.log(props.details)
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
        <Text>(Don't worry - you can update this later through proposal!)</Text>
        <Select onChange={handleSelect}>
          <option value="999"></option>
          <option value="0">I need an LLC, make one for me</option>
          <option value="1">I have created a legal entity for the DAO, and the link to its governance documents is:</option>
          <option value="2">None</option>
        </Select>
        {docType==1 ? <Input onChange={handleChange} /> : null}
        <Text>Need a form for your DAO's governance documents?  Check out our templates. (Link to page in hamburger menu?)</Text>
        {docType != 999 || (docType == 1 && docs != null) ? <Button onClick={() => props.handleNext(6)}>Next</Button> : null}
    </VStack>
  );
}
