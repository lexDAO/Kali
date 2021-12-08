import { useContext, useState } from 'react';
import AppContext from '../context/AppContext';
import ProposalDetails from './ProposalDetails';
import {
  chakra,
  Input,
  Button,
  Text,
  Flex,
  Box,
  Select,
  Badge,
  Grid,
  Icon,
  IconButton,
  Stack,
  HStack,
  VStack,
  Spacer,
  Center,
  Divider,
  Progress,
  Textarea,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton
} from "@chakra-ui/react";
import { useDisclosure } from '@chakra-ui/react';
import {
  AiOutlinePlusCircle
} from "react-icons/ai";
import {
  BsHandThumbsUpFill,
  BsHandThumbsDownFill,
  BsFillPersonPlusFill,
  BsFillPersonXFill,
  BsFillMegaphoneFill,
  BsPlusCircle,
  BsXCircle
} from "react-icons/bs";
import {
  BiLoaderCircle
} from "react-icons/bi";
import {
  GrIntegration
} from "react-icons/gr";
import {
  IoIosAddCircleOutline
} from "react-icons/io";
import FlexOutline from './FlexOutline';
import Timer from './Timer';
import { proposalDescriptions } from '../utils/appParams';
import { useClipboard } from '@chakra-ui/react'
import VotingModule from './VotingModule';

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

export default function ProposalRow(props) {
  const value = useContext(AppContext);
  const { web3, loading } = value.state;
  const p = props['p'];
  const { isOpen, onOpen, onClose } = useDisclosure();

  return(
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <HStack>
            {p['proposalType']==0 ?
            <>
            <Icon as={BsPlusCircle} boxSize={iconSize} />
            </>
            : null}

            {p['proposalType']==1 ?
            <>
            <Icon as={BsXCircle} boxSize={iconSize} />
            </>
            : null}

            {p['proposalType']==2 ?
            <>
            <Icon as={BiLoaderCircle} boxSize={iconSize} />
            </>
            : null}
            <Text casing="uppercase">{proposalDescriptions[p['proposalType']]}</Text>
          </HStack>
        </ModalHeader>
        <Divider />

        <ModalCloseButton />
        <ModalBody m={5}>

        <ProposalLabel>description</ProposalLabel>
        <Text>{p['description']}</Text>
        <ProposalDivider />

        {p['open']==true ?
        <>
          {p['proposalType']==0 ?
          <>
            <ProposalLabel>shares</ProposalLabel>
            <ProposalInput value={p['amount']} />
            <ProposalDivider />
            <ProposalLabel>account</ProposalLabel>
            <ProposalInput value={p['account']} />
            <ProposalDivider />
          </>
          : null}

          {p['proposalType']==1 ?
          <>
            <ProposalLabel>shares</ProposalLabel>
            <ProposalInput value={p['amount']} />
            <ProposalDivider />
            <ProposalLabel>account</ProposalLabel>
            <ProposalInput value={p['account']} />
            <ProposalDivider />
          </>
          : null}

          {p['proposalType']==2 ?
          <>
            <ProposalLabel>txn value</ProposalLabel>
            <ProposalInput value={p['amount']} />
            <ProposalDivider />
            <ProposalLabel>contract</ProposalLabel>
            <ProposalInput value={p['account']} />
            <ProposalDivider />
            <ProposalLabel>payload</ProposalLabel>
            <Textarea>{p['payload']}</Textarea>
            <ProposalDivider />
          </>
          : null}
        </>
        : null}
        <Center>
          {p['open']==true ?
          <VotingModule id={p['id']} address={props.address} vote={props.vote} />
        :
          <form onSubmit={props.process}>
            <Input
              type="hidden"
              name="dao"
              value={props['address']}
            />
            <Input type="hidden" name="id" value={p["id"]} />
            <Button type="submit">Process</Button>
          </form>
        }
        </Center>
        </ModalBody>

      </ModalContent>
      </Modal>

    <Box border="1px solid" rounded="xl" borderColor="black" padding="25px" margin="5px">
      <VStack>

      {p['proposalType']==0 ?
      <>
      <Icon as={BsPlusCircle} boxSize={iconSize} />
      </>
      : null}

      {p['proposalType']==1 ?
      <>
      <Icon as={BsXCircle} boxSize={iconSize} />
      </>
      : null}

      {p['proposalType']==2 ?
      <>
      <Icon as={BiLoaderCircle} boxSize={iconSize} />
      </>
      : null}

        <Text casing="uppercase">{proposalDescriptions[p['proposalType']]}</Text>
        <Timer expires={p['expires']} open={p['open']} />
        <Progress width="100%" colorScheme='green' backgroundColor='pink' value={p['progress']} />
        
        <Text casing="uppercase">
        {p['passing']==true && p['open']==true ? 'passing'
        :p['passing']==true && p['false']==true ? 'passed'
        :p['passing']==false && p['open']==true ? 'failing'
        : 'failed'
        }
        </Text>

        <Divider w="80%" align="center" />

        <Button key={p['id']} onClick={onOpen}>Review</Button>

      </VStack>
    </Box>
    </>
  )
}
