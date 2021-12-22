import { useContext, useState } from "react";
import AppContext from "../../context/AppContext";
import {
  Input,
  Button,
  Text,
  Flex,
  Box,
  Icon,
  Stack,
  HStack,
  VStack,
  Center,
  Divider,
  Modal,
  Progress,
} from "@chakra-ui/react";
import FlexOutline from "../elements/FlexOutline";
import Timer from "./Timer";
import { useClipboard } from "@chakra-ui/react";
import ProposalModal from "./ProposalModal";
import ProposalIcon from "./ProposalIcon";
import ProcessModule from "./ProcessModule";
import Sponsor from "./Sponsor";
import { useDisclosure } from "@chakra-ui/react";
import { viewProposalsHelper } from "../../constants/viewProposalsHelper";

const iconSize = 8;

export default function ProposalRow(props) {
  const value = useContext(AppContext);
  const { web3, loading } = value.state;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const p = props["p"];
  const i = props["i"];
  console.log(p["proposalType"]);
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ProposalModal p={p} i={i} />
      </Modal>

      <Box
        border="1px solid"
        rounded="xl"
        borderColor="black"
        padding="25px"
        margin="5px"
      >
        <VStack>
          <ProposalIcon p={p} />
          <Text casing="uppercase">
            {viewProposalsHelper[p["proposalType"]]["title"]}
          </Text>
          {p["pending"] == true ? (
            <Text casing="uppercase">needs sponsor</Text>
          ) : null}
          <Timer expires={p["expires"]} open={p["open"]} />
          <Progress
            width="100%"
            colorScheme="green"
            backgroundColor="pink"
            value={p["progress"]}
          />

          <Text casing="uppercase">{p["passing"]}</Text>

          <Divider w="80%" align="center" />
          <HStack>
            <Button key={p["id"]} onClick={onOpen}>
              {p["open"] == false ? "Details" : "Review & Vote"}
            </Button>
            {p["open"] == false && p["pending"] == false ? (
              <ProcessModule i={i} p={p} />
            ) : null}
            {p["pending"] == true ? <Sponsor i={i} p={p} /> : null}
          </HStack>
        </VStack>
      </Box>
    </>
  );
}
