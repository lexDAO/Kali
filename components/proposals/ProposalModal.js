import { useContext, useState } from 'react';
import AppContext from '../../context/AppContext';
import {
  chakra,
  Input,
  Button,
  Text,
  Flex,
  HStack,
  Center,
  Divider,
  Textarea,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton
} from "@chakra-ui/react";
import {
  BsHandThumbsUpFill,
  BsHandThumbsDownFill,
} from "react-icons/bs";
import Timer from './Timer';
import ProposalIcon from './ProposalIcon';
import VotingModule from './VotingModule';
import ProposalDetails from './ProposalDetails';
import { proposalDescriptions, proposalIcons } from "../../utils/viewProposalsHelper";

const ProposalLabel = (props) => {
  return(
    <Text
      casing="uppercase"
    >
      <b>{props.children}</b>
    </Text>
  )
}

const ProposalInput = (props) => {
  return(
    <Input value={props.value} disabled />
  )
}

const ProposalDivider = (props) => {
  return(
    <Divider mb={5} />
  )
}

const iconSize = 8;

export default function ProposalModal(props) {
  const value = useContext(AppContext);
  const { web3, loading } = value.state;
  const p = props['p'];
  const i = props['i'];

  return(
    <>

      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <HStack>
            <ProposalIcon p={p} />
            <Text casing="uppercase">{proposalDescriptions[p['proposalType']]}</Text>
          </HStack>
        </ModalHeader>
        <Divider />

        <ModalCloseButton />
        <ModalBody m={5}>

        <ProposalLabel>description</ProposalLabel>
        <Text>{p['description']}</Text>
        <ProposalDivider />

        <ProposalDetails p={p} i={i} />

        <Center>
          {p['open']==true ?
          <VotingModule p={p} />
        :

          <i>voting has closed</i>
        }
        </Center>
        </ModalBody>

      </ModalContent>

    </>
  )
}
