import { useContext, useState } from 'react';
import AppContext from '../../context/AppContext';
import {
  Icon
} from "@chakra-ui/react";

const iconSize = 8;
import { proposalIcons } from "../../utils/viewProposalsHelper";

export default function ProposalRow(props) {
  const value = useContext(AppContext);
  const { web3, loading } = value.state;
  const p = props['p'];

  return(
    <>
      <Icon as={proposalIcons[p['proposalType']]} boxSize={iconSize} />
    </>
  )
}
