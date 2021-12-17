import { useState, useContext, useEffect } from 'react';
import Router, { useRouter } from "next/router";
import AppContext from '../../context/AppContext';
import {
  Input,
  Button,
  Select,
  Text,
  Textarea,
  Stack,
  HStack
} from "@chakra-ui/react";
import NumInputField from "../elements/NumInputField";
import { tokenHelper } from "../../utils/helpers";

export default function Tribute() {
  const value = useContext(AppContext);
  const { web3, loading, account, extensions, address, crowdsale, balances } = value.state;
  const token = tokenHelper(balances, crowdsale, web3);

  const [shares, setShares] = useState(0); // calculates # of shares you get for purchase price
  const handleChange = value => setShares(value);

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
          account_,
          amount_
        } = array; // this must contain any inputs from custom forms

        var value_ = 0;
        if(crowdsale["purchaseToken"] == "0x0000000000000000000000000000000000000000") {
          value_=amount_;
        }

        const calldata = "0x";

        amount_ = web3.utils.toWei(amount_);

        const abi_ = require("../../abi/KaliDAOcrowdsale.json");
        const address_ = extensions['crowdsale'];
        const instance_ = new web3.eth.Contract(abi_, address_);
        console.log(instance_)

        try {
          let result = await instance_.methods
            .callExtension(account_, amount_, calldata)
            .send({ from: account, value: value_ });
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
      <Text><b>Recipient</b></Text>
      <Input name="account_" size="lg" placeholder="0x or .eth"></Input>

      <HStack>
        <Text><b>Purchase Amount ({token}):</b></Text>
        <NumInputField name="amount_" min=".000000000000000001" onChange={handleChange} />

        <Text><b>Shares</b></Text>
        <Input value={shares} disabled />
      </HStack>

      <Button type="submit">Submit Proposal</Button>
    </Stack>
    </form>
  );
}
