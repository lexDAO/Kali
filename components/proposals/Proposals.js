import { useState, useContext, useEffect } from 'react';
import Router, { useRouter } from "next/router";
import AppContext from '../../context/AppContext';
//import ProposalDetails from './ProposalDetails';
import {
  chakra,
  Center,
  Text,
  Grid
} from "@chakra-ui/react";
import Layout from '../structure/Layout';
const abi = require("../../abi/KaliDAO.json");
import ProposalRow from "./ProposalRow"
import { proposalTypes, voteTypes } from "../../utils/appParams";

export default function Proposals(props) {
  const value = useContext(AppContext);
  const { web3, loading, proposals, address } = value.state;

  return(
    <>
      {proposals === null ?
        <Text>Loading . . . </Text>
        :
        <>
        {proposals.length==0 ? 'Awaiting Proposals' :
        <Grid templateColumns={{sm: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)'}}>
          {proposals.map((p, index) => (

            <ProposalRow
              key={index}
              p={p}
              i={index}
            />
          ))}
        </Grid>
        }
        </>
      }
    </>
  )
}
