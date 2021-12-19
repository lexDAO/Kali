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
import { tokenHelper, toDecimals, unixToDate } from "../../utils/helpers";

export default function Tribute() {
  const value = useContext(AppContext);
  const { web3, loading, account, extensions, address, crowdsale, balances, abi } = value.state;
  const token = crowdsale['tokenName']
  const [amt, setAmt] = useState(0); // amount to be spent on shares, not converted to wei/decimals
  const handleChange = value => setAmt(value);

  const approveSpend = async () => {
    if(account===null) {
      alert("Please connect to wallet");
    } else {
      value.setLoading(true);
      let amt_ = toDecimals(amt, crowdsale['decimals']).toString()
      const abi_ = require("../../abi/ERC20.json");
      const instance_ = new web3.eth.Contract(abi_, crowdsale['purchaseToken']);
      let spender = extensions['crowdsale'];
      let result = await instance_.methods.approve(spender, amt_).send({ from: account });
      value.setLoading(false);
    }
  }

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
          amount_
        } = array; // this must contain any inputs from custom forms

        amount_ = toDecimals(amount_, crowdsale['decimals']).toString();
        console.log("amount")
        console.log(amount_);

        var value_ = 0;
        if(crowdsale["purchaseToken"] == "0x0000000000000000000000000000000000000000") {
          value_ = amount_;
        }
        console.log("value")
        console.log(value_)

        var extAddress = extensions['crowdsale'];
        console.log(extAddress)

        const calldata = "0x";

        const instance = new web3.eth.Contract(abi, address);
        console.log(instance)

        try {
          let result = await instance.methods
            .callExtension(extAddress, amount_, calldata, 1)
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
      <Text>Sale ends {unixToDate(crowdsale['saleEnds'])}</Text>
      <HStack>
        <Text><b>Purchase Amount ({token}):</b></Text>
        <NumInputField name="amount_" min=".000000000000000001" onChange={handleChange} />

        <Text><b>Shares</b></Text>
        <Input value={amt * crowdsale['purchaseMultiplier']} disabled />

      </HStack>
      {crowdsale['purchaseToken'] != "0x0000000000000000000000000000000000000000" ?
        <Button onClick={approveSpend}>Approve</Button>
        : null
      }

      <Button type="submit">Purchase Shares</Button>

    </Stack>
    </form>
  );
}
