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
import { proposalDetails, extensionParams } from "../../utils/viewProposalsHelper";

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
  let decoded;
  if(type==8) {
    let params = extensionParams[0][p['extension']];
    if(params != null) {
      decoded = JSON.stringify(web3.eth.abi.decodeParameters(params, p['payload']));
    }
  }
  if(type==2) {
    if(p['payload'].includes("0xa9059cbb", 0)) {
      params = ['address', 'uint256'];
      let bytecode = p['payload'].replace('0xa9059cbb','');
      console.log(bytecode)
      decoded = JSON.stringify(web3.eth.abi.decodeParameters(params, "0x"+bytecode));
    }
  }
  console.log(params)

  return(
    <>
        <Text casing="uppercase">Submitted by {p['proposer']}</Text>
        <ProposalDivider />

        <ProposalLabel>description</ProposalLabel>
        <Text>{p['description']}</Text>
        <ProposalDivider />

        {proposalDetails[type][0] == null ? null :
        <>
        <ProposalLabel>{proposalDetails[type][0]}</ProposalLabel>
        <Text>{p['amount']}</Text>
        <ProposalDivider />
        </>
        }
        {type==8 ?
          <>
        <ProposalLabel>Extension type</ProposalLabel>
        <Text>{p['extension']}</Text>
        <ProposalDivider />
          </>
        : null}
        {proposalDetails[type][1] == null ? null :
        <>
        <ProposalLabel>{proposalDetails[type][1]}</ProposalLabel>
        <Text>{p['account']}</Text>
        <ProposalDivider />
        </>
        }
        {proposalDetails[type][2] == null ? null :
        <>
        <ProposalLabel>payload</ProposalLabel>
        <Text>{p['payload']}</Text>
        <Text>Decoded: {decoded}</Text>
        <ProposalDivider />
        </>
        }
    </>
  )
}
