import { useContext, useState } from 'react';
import AppContext from '../context/AppContext';
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

export default function ProposalDetails(props) {

  const p = props['p'];

  return(

    <Box>
        <Text>{p}</Text>
    </Box>
  );
}
