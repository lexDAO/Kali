import React from "react";
import { Button, HStack } from "@chakra-ui/react";
import FlexGradient from "../elements/FlexGradient.js";
import TokenForm from "./TokenForm.js";
import NftForm from "./NftForm.js";

export default function TokenCreator() {
  const [tokenVisible, setTokenVisible] = useState(false);
  const [nftVisible, setNftVisible] = useState(false);

  const toggleTokenCreation = () => {
    setTokenVisible(() => !tokenVisible);
  };

  const toggleNftCreation = () => {
    setNftVisible(() => !nftVisible);
  };

  return (
    <FlexGradient>
      <HStack>
        <Button onClick={toggleTokenCreation}>Gift ERC20</Button>
        <Button onClick={toggleNftCreation}>Gift ERC721</Button>
      </HStack>
      <>{tokenVisible ? <TokenForm dao={dao["address"]} /> : null}</>
      <>{nftVisible ? <NftForm dao={dao["address"]} /> : null}</>
    </FlexGradient>
  );
}
