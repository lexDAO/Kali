import { useContext, useState } from 'react';
import AppContext from '../context/AppContext';
import ProposalDetails from './ProposalDetails';
import {
  Button,
  Text,
  Flex,
  IconButton,
  HStack,
  VStack,
  Input,
  Divider
} from "@chakra-ui/react";
import { useDisclosure } from '@chakra-ui/react';
import {
  AiOutlinePlusCircle
} from "react-icons/ai";
import {
  BsHandThumbsUpFill,
  BsHandThumbsDownFill,
} from "react-icons/bs";

export default function ProposalRow(props) {
  const value = useContext(AppContext);
  const { web3, loading } = value.state;

  return(
    <VStack border="#ccc" backgroundColor="#eee" width="100%" p={5} rounded="lg">
      <Text fontSize="lg"><b>VOTE</b></Text>
      <HStack gap={3}>
      <form onSubmit={props.vote}>
        <Input
          type="hidden"
          name="dao"
          value={props['address']}
        />
        <Input type="hidden" name="id" value={props["id"]} />
        <Input type="hidden" name="approval" value={1} />
        <IconButton
          icon={<BsHandThumbsUpFill />}
          size='lg'
          type="submit"
        />
      </form>

      <form onSubmit={props.vote}>
        <Input
          type="hidden"
          name="dao"
          value={props['address']}
        />
        <Input type="hidden" name="id" value={props["id"]} />
        <Input type="hidden" name="approval" value={0} />
        <IconButton
          icon={<BsHandThumbsDownFill />}
          size='lg'
          type="submit"
        />
      </form>
      </HStack>
    </VStack>
  )
}
