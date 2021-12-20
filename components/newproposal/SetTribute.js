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
import { extensions } from "../../utils/addresses";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import NumInputField from "../elements/NumInputField";
import { alertMessage } from "../../utils/helpers";

export default function SetTribute() {
  const value = useContext(AppContext);
  const { web3, loading, account, abi, address, chainId, balances } = value.state;

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
          proposalType_
        } = array; // this must contain any inputs from custom forms

        const amount_ = 0;

        const payload_ = Array(0);

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
        }
      } catch(e) {
        alertMessage('send-transaction');
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

      <Input type="hidden" name="proposalType_" value="8" />
      <Input type="hidden" name="account_" value={extensions[chainId]['tribute']} />

      <Button type="submit">Submit Proposal</Button>
    </Stack>
    </form>
  );
}
