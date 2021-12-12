import { useState, useContext, useEffect } from 'react';
import Router, { useRouter } from "next/router";
import AppContext from '../../context/AppContext';
import {
  Input,
  Button,
  Select,
  Text,
  Textarea,
  Stack
} from "@chakra-ui/react";
import NumInputField from "../elements/NumInputField";

export default function SendShares() {
  const value = useContext(AppContext);
  const { web3, loading, account, abi, address } = value.state;

  const submitProposal = async (event) => {
    event.preventDefault();
    value.setLoading(true);

    if(account===null) {
      alert("Please connect to wallet");
    } else {
      try {
        let object = event.target;
        var array = [];
        for (let i = 0; i < object.length; i++) {
          array[object[i].name] = object[i].value;
        }

        var {
          description_,
          account_,
          amount_,
          proposalType_
        } = array; // this must contain any inputs from custom forms

        const payload_ = Array(0);

        const instance = new web3.eth.Contract(abi, address);

        amount_ = web3.utils.toWei(amount_);

        try {
          let result = await instance.methods
            .propose(proposalType_, description_, [account_], [amount_], [payload_])
            .send({ from: account });
            value.setReload(value.state.reload+1);
            value.setVisibleView(1);
        } catch (e) {
          alert(e);
          value.setLoading(false);
        }
      } catch(e) {
        alert(e);
        value.setLoading(false);
      }
    }

    value.setLoading(false);
  };

  return (
    <form onSubmit={submitProposal}>
    <Stack>
      <Text><b>Details</b></Text>

      <Textarea name="description_" size="lg" placeholder=". . ." />

      <Text><b>Recipient</b></Text>
      <Input name="account_" size="lg" placeholder="0x or .eth"></Input>

      <Text><b>Shares</b></Text>
      <NumInputField name="amount_" />

      <Input type="hidden" name="proposalType_" value="0" />

      <Button type="submit">Submit Proposal</Button>
    </Stack>
    </form>
  );
}
