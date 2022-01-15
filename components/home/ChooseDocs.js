import React, { useState, useContext, useEffect } from "react";
import AppContext from "../../context/AppContext";
import {
  Flex,
  VStack,
  HStack,
  Button,
  Text,
  List,
  ListItem,
  Link,
  Select,
  Input,
  Heading,
  Icon
} from "@chakra-ui/react";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { supportedChains } from "../../constants/supportedChains";
import { getNetworkName } from "../../utils/formatters";
import { presets } from "../../constants/presets";
import { extensionDescriptions } from "../../constants/extensionsHelper";

export default function ChooseDocs(props) {
  const value = useContext(AppContext);
  const { web3, chainId, loading, account } = value.state;
  const [selectedType, setSelectedType] = useState(999);

  useEffect(() => {
    if (props.details["docType"] != null) {
      setSelectedType(props.details["docType"]);
    }
  }, []);

  const handleSelect = (e) => {
    let type = e.target.value;
    let array = props.details;
    array["docType"] = type;
    if (type == 0) {
      array["docs"] = "";
    }
    if (type == 2) {
      array["docs"] = "none";
    }
    setSelectedType(type);
    props.setDetails(array);
  };

  const handleChange = (e) => {
    let array = props.details;
    array["docs"] = e.target.value;
    props.setDetails(array);
    console.log(props.details);
  };

  const templateOptions = () => [
    {
      name: "DAO Charter",
      url: "https://github.com/lexDAO/Kali/blob/main/legal/formation/Charter.md",
    },
    {
      name: "Trustless Unincorporated Nonprofit Association Agreement",
      url: "https://github.com/lexDAO/Kali/blob/main/legal/formation/una/TUNAA.md",
    },
    {
      name: "Delaware LLC Operating Agreement",
      url: "https://github.com/lexDAO/Kali/blob/main/legal/formation/llc/DelawareOA.md",
    },
  ];

  return (
    <>
    <VStack>
      <Heading as="h1">Add your legal docs:</Heading>
      <Select id="choose-docs" onChange={handleSelect} defaultValue={props.details["docType"]}>
        <option value="999"></option>
        <option value="0">Form an LLC</option>
        <option value="1">Use your own docs</option>
        <option value="2">None</option>
      </Select>
      {selectedType == 1 ? (
        <Input defaultValue={props.details["docs"]} onChange={handleChange} />
      ) : null}
    </VStack>
    <VStack>
      <>
      {selectedType == 0 ? (
        <HStack>
        <Icon as={AiOutlineInfoCircle} />
        <Text as="i">
          Your DAO will be issued a series NFT under KaliCo Ricardian LLC, a
          Delaware Series LLC. Click{" "}
          <Link
            href="https://ricardian.gitbook.io/ricardian-llc/"
            target="_blank"
            isExternal
            rel="noopener noreferrer"
            color="kali.600"
          >
            here
          </Link>
          {"  "}
          to learn more.
        </Text>
        </HStack>
      ) : null}

      {selectedType != 999 ? (
        <Button className="transparent-btn" onClick={() => props.handleNext()}>Next</Button>
      ) : null}
      </>
    </VStack>
    </>
  );
}
