import { useState, useContext, useEffect } from "react";
import Router, { useRouter } from "next/router";
import AppContext from "../../context/AppContext";
import {
  Input,
  Button,
  Select,
  Text,
  Textarea,
  Stack,
  HStack,
} from "@chakra-ui/react";
import NumInputField from "../elements/NumInputField";
import { toDecimals, unixToDate } from "../../utils/formatters";

export default function Redemption() {
  const value = useContext(AppContext);
  const { web3, loading, account, address, dao, abi } = value.state;
  const [amt, setAmt] = useState(0); // amount to be spent on shares, not converted to wei/decimals
  const handleChange = (value) => setAmt(value);
  const extAddress = dao["extensions"]["redemption"]["address"];
  const redeemables = dao["extensions"]["redemption"]["details"]["redeemables"];
  const redemptionStarts =
    dao["extensions"]["redemption"]["details"]["redemptionStarts"];

  const submitProposal = async (event) => {
    event.preventDefault();
    value.setLoading(true);

    try {
      let object = event.target;
      var array = [];
      for (let i = 0; i < object.length; i++) {
        array[object[i].name] = object[i].value;
      }

      var { amount_ } = array; // this must contain any inputs from custom forms

      amount_ = web3.utils.toWei(amount_);

      const calldata = "0x";
      console.log(calldata);

      const instance = new web3.eth.Contract(abi, address);

      try {
        let result = await instance.methods
          .callExtension(extAddress, amount_, calldata)
          .send({ from: account });
        value.setVisibleView(1);
      } catch (e) {
        value.toast(e);
        value.setLoading(false);
      }
    } catch (e) {
      value.toast(e);
      value.setLoading(false);
    }

    value.setLoading(false);
  };

  return (
    <form onSubmit={submitProposal}>
      <Stack>
        <Text>Redemption begins {unixToDate(redemptionStarts)}</Text>
        <Text>Redeemables:</Text>
        {redeemables.map((r, index) => (
          <Text key={index}>{r}</Text>
        ))}
        <Text>
          <b>Amount:</b>
        </Text>
        <NumInputField name="amount_" min=".000000000000000001" />
        <Button type="submit">Redeem Shares</Button>
      </Stack>
    </form>
  );
}
