import { useContext, useState } from "react";
import AppContext from "../../context/AppContext";
import {
  chakra,
  Input,
  Button,
  Text,
  HStack,
  Center,
  Divider,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { BsHandThumbsUpFill, BsHandThumbsDownFill } from "react-icons/bs";
import Timer from "./Timer";
import ProposalIcon from "./ProposalIcon";
import VotingModule from "./VotingModule";
import ProposalDetails from "./ProposalDetails";
import Sponsor from "./Sponsor";
import { viewProposalsHelper } from "../../constants/viewProposalsHelper";

const ProposalLabel = (props) => {
  return (
    <Text casing="uppercase">
      <b>{props.children}</b>
    </Text>
  );
};

const ProposalInput = (props) => {
  return <Input value={props.value} disabled />;
};

const ProposalDivider = (props) => {
  return <Divider mb={5} />;
};

const iconSize = 8;

export default function ProposalModal(props) {
  const value = useContext(AppContext);
  const { web3, loading, account } = value.state;
  const p = props["p"];
  const i = props["i"];

  return (
    <>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <HStack>
            <ProposalIcon p={p} />
            <Text casing="uppercase">
              {viewProposalsHelper[p["proposalType"]]["title"]}
            </Text>
          </HStack>
        </ModalHeader>
        <Divider />

        <ModalCloseButton />
        <ModalBody m={5}>
          <ProposalDetails p={p} i={i} />

          <Center>
            {props.isExpired == false ?
              account == null ?
              <>
                <Text><i>Please connect to your account to vote.</i></Text>
              </>
              : <VotingModule p={p} />
            : null}
            {p["pending"] == true ? <Sponsor p={p} /> : null}
          </Center>
        </ModalBody>
      </ModalContent>
    </>
  );
}
