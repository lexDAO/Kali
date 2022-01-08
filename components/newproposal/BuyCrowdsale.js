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
import { toDecimals, fromDecimals, unixToDate } from "../../utils/formatters";

export default function Tribute() {
  const value = useContext(AppContext);
  const { web3, loading, account, address, abi, dao } = value.state;
  const [amt, setAmt] = useState(0); // amount to be spent on shares, not converted to wei/decimals
  const handleChange = (value) => setAmt(value);
  const token = dao["extensions"]["crowdsale"]["details"]["tokenName"];
  const purchaseToken =
    dao["extensions"]["crowdsale"]["details"]["purchaseToken"];
  const purchaseMultiplier =
    dao["extensions"]["crowdsale"]["details"]["purchaseMultiplier"];
  const purchaseLimit =
    dao["extensions"]["crowdsale"]["details"]["purchaseLimit"];
  const saleEnds = dao["extensions"]["crowdsale"]["details"]["saleEnds"];
  const decimals = dao["extensions"]["crowdsale"]["details"]["decimals"];
  const extAddress = dao["extensions"]["crowdsale"]["address"];

  const approveSpend = async () => {
    try {
      value.setLoading(true);
      let amt_ = toDecimals(amt, decimals).toString(); // toWei() won't work for tokens with less than 18 decimals
      const abi_ = require("../../abi/ERC20.json");
      const instance_ = new web3.eth.Contract(abi_, purchaseToken);
      let result = await instance_.methods
        .approve(extAddress, amt_)
        .send({ from: account });
      value.setLoading(false);
    } catch(e) {
      value.toast(e);
    }
  };

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

      amount_ = toDecimals(amount_, decimals).toString();

      console.log("amount_", amount_)

      var value_ = 0;
      if (purchaseToken == "0x0000000000000000000000000000000000000000") {
        value_ = amount_;
      }
      
      const saleAbi = require("../../abi/KaliDAOcrowdsale.json");
      
      const instance = new web3.eth.Contract(saleAbi, extAddress);

      try {
        let result = await instance.methods
          .callExtension(address, amount_)
          .send({ from: account, value: value_ });
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
    <>
      <form onSubmit={submitProposal}>
        <Stack>
          <Text>Sale Details</Text>
          <Text>
            Price: {1 / purchaseMultiplier} {token} ({purchaseMultiplier} shares
            per {token})
          </Text>
          <Text>Maximum shares allowed: {fromDecimals(purchaseLimit, 18)}</Text>
          <Text>Sale ends {unixToDate(saleEnds)}</Text>
          <HStack>
            <Text>
              <b>Purchase Amount ({token}):</b>
            </Text>
            <NumInputField
              name="amount_"
              min=".000000000000000001"
              max={purchaseLimit / purchaseMultiplier}
              onChange={handleChange}
            />

            <Text>
              <b>Shares</b>
            </Text>
            <Input value={amt * purchaseMultiplier} disabled />
          </HStack>
          {purchaseToken != "0x0000000000000000000000000000000000000000" ? (
            <Button onClick={approveSpend}>Approve</Button>
          ) : null}

          <Button type="submit">Purchase Shares</Button>
        </Stack>
      </form>
    </>
  );
}
