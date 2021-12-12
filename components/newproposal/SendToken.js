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
import { tokenBalances } from '../../utils/tokens';
import NumInputField from "../elements/NumInputField";

export default function SendToken() {
  const value = useContext(AppContext);
  const { web3, loading, account, abi, address, balances } = value.state;

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
          proposalType_,
          description_,
          account_,
          amount_,
          amount_,
          recipient_,
          tokenAmount_
        } = array; // this must contain any inputs from custom forms

        console.log(array);

        tokenAmount_ = web3.utils.toWei(tokenAmount_);

        const instance = new web3.eth.Contract(abi, address);

        const ierc20 = require('../../abi/ERC20.json');
        const tokenContract = new web3.eth.Contract(ierc20, account_);
        var payload_ = tokenContract.methods.transfer(recipient_, tokenAmount_).encodeABI();

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
      <Input name="recipient_" size="lg" placeholder="0x or .eth"></Input>
      <Text><b>Token</b></Text>

      <Select
        name="account_"
        color="kali.800"
        bg="kali.900"
        opacity="0.9"
      >
        {balances.map((b, index) => (

          <option key={index} value={b['address']}>{b['token']} (balance: {web3.utils.fromWei(b['balance'])})</option>
        ))}
      </Select>
      <Text>
        <b>Amount</b>
      </Text>
      <NumInputField name="tokenAmount_" />

      <Input type="hidden" name="proposalType_" value="2" />

      <Input type="hidden" name="amount_" value="0" />

      <Button type="submit">Submit Proposal</Button>
    </Stack>
    </form>
  );
}
