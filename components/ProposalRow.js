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
  Textarea
} from "@chakra-ui/react";
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

const ProposalDetail = (props) => {
  return(
    <Box
      border="1px solid"
      padding="10px"
    >
      {props.children}
    </Box>
  )
}

const ProposalBlock = (props) => {
  return(
    <VStack
      width="100%"
      spacing={0}
      p={3}
    >
      {props.children}
    </VStack>
  )
}

const iconSize = 8;

export default function ProposalRow(props) {
  const value = useContext(AppContext);
  const { web3, loading } = value.state;
  const p = props['p'];
  const [open, setOpen] = useState(false);

  return(

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
        :p['passing']==false && p['open']==false ? 'failing'
        : 'failed'
        }
        </Text>

        <Divider w="80%" align="center" />

        {open==true ?
          <>
        <ProposalBlock>
          <ProposalLabel>description</ProposalLabel>
          <Text>{p['description']}</Text>
        </ProposalBlock>

        {p['proposalType']==0 ?
        <>
        <ProposalBlock>
          <ProposalLabel>shares</ProposalLabel>
          <ProposalInput value={p['amount']} />
        </ProposalBlock>
        <ProposalBlock>
          <ProposalLabel>account</ProposalLabel>
          <ProposalInput value={p['account']} />
        </ProposalBlock>
        </>
        : null}

        {p['proposalType']==1 ?
        <>
        <ProposalBlock>
          <ProposalLabel>shares</ProposalLabel>
          <ProposalInput value={p['amount']} />
        </ProposalBlock>
        <ProposalBlock>
          <ProposalLabel>account</ProposalLabel>
          <ProposalInput value={p['account']} />
        </ProposalBlock>
        </>
        : null}

        {p['proposalType']==2 ?
        <>
        <ProposalBlock>
          <ProposalLabel>txn value</ProposalLabel>
          <ProposalInput value={p['amount']} />
        </ProposalBlock>
        <ProposalBlock>
          <ProposalLabel>contract</ProposalLabel>
          <ProposalInput value={p['account']} />
        </ProposalBlock>
        <ProposalBlock>
          <ProposalLabel>payload</ProposalLabel>
          <Textarea>{p['payload']}</Textarea>
        </ProposalBlock>
        </>
        : null}

        <Divider w="80%" align="center" />
        {p["open"] ? <Text>VOTE:</Text> : null}
        <HStack>
            {p["open"] ? (
              <>
                <form onSubmit={props.vote}>
                  <Input
                    type="hidden"
                    name="dao"
                    value={props['address']}
                  />
                  <Input type="hidden" name="id" value={p["id"]} />
                  <Input type="hidden" name="approval" value={1} />
                  <IconButton
                    icon={<BsHandThumbsUpFill />}
                    type="submit"
                  />
                </form>

                <form onSubmit={props.vote}>
                  <Input
                    type="hidden"
                    name="dao"
                    value={props['address']}
                  />
                  <Input type="hidden" name="id" value={p["id"]} />
                  <Input type="hidden" name="approval" value={0} />
                  <IconButton
                    icon={<BsHandThumbsDownFill />}
                    type="submit"
                  />
                </form>
              </>
            ) : (
              <>
                <form onSubmit={props.process}>
                  <Input
                    type="hidden"
                    name="dao"
                    value={props['address']}
                  />
                  <Input type="hidden" name="id" value={p["id"]} />
                  <Button type="submit">Process</Button>
                </form>
              </>
            )}
          </HStack>
          </>
          :
          <>
            <Button key={p['id']} onClick={() => props.setActiveProposal(p['id'])}>Review</Button>
          </>
        }

      </VStack>
    </Box>
  )
}
