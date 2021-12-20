import React, { useState, useContext, useEffect } from 'react';
import Router, { useRouter } from "next/router";
import AppContext from '../../context/AppContext';
import {
  Input,
  Button,
  Text,
  Textarea,
  Stack,
  Select
} from "@chakra-ui/react";
import NumInputField from "../elements/NumInputField";
import DateSelect from "../elements/DateSelect";
import { alertMessage } from "../../utils/helpers";

export default function SetRedemption() {
  const value = useContext(AppContext);
  const { web3, loading, account, abi, address, chainId, balances, extensions, redemption } = value.state;
  const [startDate, setStartDate] = useState(new Date());

  const updateExtType = (e) => {
    let newValue = e.target.value;
    setExtType(newValue);
  };

  const submitProposal = async (event) => {
    event.preventDefault();
    value.setLoading(true);

    if(account===null) {
      alertMessage('connect');
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
          proposalType_,
          tokens_,
          redemptionStart_
        } = array; // this must contain any inputs from custom forms

        var amount_ = 0;

        if(extensions['redemption']==null) {
          amount_ = 1; // prevent toggling extension back off
        }
        console.log("amount:" + amount_);
        console.log(extensions)

        const tokenArray = tokens_.split(",");

        redemptionStart_ = new Date(redemptionStart_).getTime() / 1000;

        const payload_ = web3.eth.abi.encodeParameters(
          ['address[]','uint256'],
          [tokenArray, redemptionStart_]
        );
        console.log(payload_)

        const instance = new web3.eth.Contract(abi, address);

        try {
          let result = await instance.methods
            .propose(proposalType_, description_, [account_], [amount_], [payload_])
            .send({ from: account });
            value.setReload(value.state.reload+1);
            value.setVisibleView(1);
        } catch (e) {
          alertMessage('send-transaction');
          value.setLoading(false);
          console.log(e);
        }
      } catch(e) {
        alertMessage('send-transaction');
        value.setLoading(false);
        console.log(e);
      }
    }

    value.setLoading(false);
  };

  return (
    <form onSubmit={submitProposal}>
    <Stack>
      <Text><b>Details</b></Text>
      <Textarea name="description_" size="lg" placeholder=". . ." />

      <Text><b>Token Addresses (separate by comma)</b></Text>
      <Textarea name="tokens_" placeholder="" />

      <Text>Redemption Start</Text>

      <DateSelect name="redemptionStart_" />


      <Input type="hidden" name="proposalType_" value="8" />
      <Input type="hidden" name="account_" value={extensions['redemption']} />

      <Button type="submit">Submit Proposal</Button>
    </Stack>
    </form>
  );
}
