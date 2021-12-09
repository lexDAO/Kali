import { useContext, useState } from 'react';
import AppContext from '../../context/AppContext';
import {
  Icon
} from "@chakra-ui/react";
import {
  BsPlusCircle,
  BsXCircle
} from "react-icons/bs";
import {
  BiLoaderCircle
} from "react-icons/bi";

const iconSize = 8;

export default function ProposalRow(props) {
  const value = useContext(AppContext);
  const { web3, loading } = value.state;
  const p = props['p'];

  return(
    <>
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
    </>
  )
}
