import { useState, useContext, useEffect } from 'react';
import Router, { useRouter } from "next/router";
import AppContext from '../../context/AppContext';
//import ProposalDetails from './ProposalDetails';
import {
  chakra,
  Center,
  Text,
  Grid,
  Button
} from "@chakra-ui/react";
import Layout from '../structure/Layout';
const abi = require("../../abi/KaliDAO.json");
import ProposalRow from "./ProposalRow"
import { proposalTypes, voteTypes } from "../../utils/appParams";

export default function Proposals(props) {
  const value = useContext(AppContext);
  const { web3, loading, proposals, address } = value.state;
  const [sponsoredVisible, setSponsoredVisible] = useState(true);

  const proposalFilter = () => {
    setSponsoredVisible(!sponsoredVisible);
    console.log(sponsoredVisible)
  }

  return(
    <>
      <Button onClick = {proposalFilter}>
      {sponsoredVisible==true ? 'Show Unsponsored' : 'Show Sponsored'}
      </Button>
      {proposals === null ?
        <Text>Loading . . . </Text>
        :
        <>
        {proposals.length==0 ? 'Awaiting Proposals' :
        <Grid templateColumns={{sm: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)'}}>
          {proposals.map((p, index) => (
            (p['inLimbo']==true && sponsoredVisible==false) || (p['inLimbo']==false && sponsoredVisible==true) ?
            <ProposalRow
              key={index}
              p={p}
              i={index}
            />
            : null
          ))}
        </Grid>
        }
        </>
      }
    </>
  )
}
