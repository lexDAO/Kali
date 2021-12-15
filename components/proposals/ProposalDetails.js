import { useContext, useState } from 'react';
import AppContext from '../../context/AppContext';
import ProposalDetails from './ProposalDetails';
import {
  chakra,
  Input,
  Text,
  Textarea,
  Divider
} from "@chakra-ui/react";
import { proposalDetails } from "../../utils/viewProposalsHelper";

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

export default function ProposalModal(props) {
  const value = useContext(AppContext);
  const { web3, loading } = value.state;
  const p = props['p'];
  const type = p['proposalType'];

  return(
    <>
        {proposalDetails[type][0] == null ? null :
        <>
        <ProposalLabel>{proposalDetails[type][0]}</ProposalLabel>
        <ProposalInput value={p['amount']} />
        <ProposalDivider />
        </>
        }
        {proposalDetails[type][1] == null ? null :
        <>
        <ProposalLabel>{proposalDetails[type][1]}</ProposalLabel>
        <ProposalInput value={p['account']} />
        <ProposalDivider />
        </>
        }
        {proposalDetails[type][2] == null ? null :
        <>
        <ProposalLabel>payload</ProposalLabel>
        <Textarea>{p['payload']}</Textarea>
        <ProposalDivider />
        </>
        }
    </>
  )
}
