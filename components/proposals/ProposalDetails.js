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

  return(
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
  )
}
