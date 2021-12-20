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
import { tokenHelper, toDecimals, unixToDate, alertMessage } from "../../utils/helpers";

export default function Redemption() {
  const value = useContext(AppContext);
  const { web3, loading, account, extensions, address, redemption, balances, abi } = value.state;
  const [amt, setAmt] = useState(0); // amount to be spent on shares, not converted to wei/decimals
  const handleChange = value => setAmt(value);
  const redeemables = redemption['redeemables'];

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
          amount_
        } = array; // this must contain any inputs from custom forms

        amount_ = web3.utils.toWei(amount_);

        var extAddress = extensions['redemption'];
        console.log("extAddress")
        console.log(extAddress)

        const calldata = "0x";
        console.log(calldata)

        const instance = new web3.eth.Contract(abi, address);
        console.log(instance)

        try {
          let result = await instance.methods
            .callExtension(extAddress, amount_, calldata, 0)
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
        <Text>Redemption begins {unixToDate(redemption['redemptionStarts'])}</Text>
        <Text>Redeemables:</Text>
        {redeemables.map((r, index) => (
        <Text>{r}</Text>
        ))}
        <Text><b>Amount:</b></Text>
        <NumInputField
          name="amount_"
          min=".000000000000000001"
        />
        <Button type="submit">Redeem Shares</Button>
      </Stack>
    </form>
  );
}
