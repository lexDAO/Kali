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
  const { web3, loading, proposals, pendingProposals, address } = value.state;
  const [toggle, setToggle] = useState(0);

  const propViews = [proposals, pendingProposals];

  console.log(proposals)

  const handleClick = () => {
    if(toggle==1) {
      setToggle(0);
    } else {
      setToggle(1);
    }
  }

  const ProposalContainer = (props) => {
    return(
    <>
    {props['proposals'].length==0 ? 'Awaiting Proposals' :
    <Grid templateColumns={{sm: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)'}}>
      {props['proposals'].map((p, index) => (

        <ProposalRow
          key={index}
          p={p}
          i={index}
        />

      ))}
    </Grid>
    }
    </>
  );
  }

  return(
    <>
      <Button onClick={handleClick}>
        {toggle==false ? 'Show Unsponsored' : 'Show Active'}
      </Button>
      {propViews[toggle] != null ?
      <ProposalContainer proposals={propViews[toggle]} />
      : null}

    </>
  )
}
