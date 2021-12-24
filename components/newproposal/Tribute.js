import { useState, useContext, useEffect } from "react";
import Router, { useRouter } from "next/router";
import AppContext from "../../context/AppContext";
import { Input, Button, Select, Text, Textarea, Stack } from "@chakra-ui/react";
import NumInputField from "../elements/NumInputField";

export default function BuyCrowdsale() {
  const value = useContext(AppContext);
  const {
    web3,
    loading,
    account,
    isMember,
    chainId,
    extensions,
    address,
    abi,
  } = value.state;

  const submitProposal = async (event) => {
    event.preventDefault();
    value.setLoading(true);

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
        proposalType_,
        asset_,
        assetAmount_,
      } = array; // this must contain any inputs from custom forms

      const payload_ = Array(0);

      const tribAbi = require("../../abi/KaliDAOtribute.json");

      const tribAddress = extensions.tribute;

      const instance = new web3.eth.Contract(tribAbi, tribAddress);

      amount_ = web3.utils.toWei(amount_);

      assetAmount_ = web3.utils.toWei(assetAmount_);

      asset_ = "0x0000000000000000000000000000000000000000";

      const nft = "false";

      try {
        let result = await instance.methods
          .submitTributeProposal(
            address,
            proposalType_,
            description_,
            [account_],
            [amount_],
            [payload_],
            nft,
            asset_,
            assetAmount_
          )
          .send({ from: account, value: assetAmount_ });
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
        <Text>
          <b>Details</b>
        </Text>

        <Textarea name="description_" size="lg" placeholder=". . ." />

        <Text>
          <b>Recipient</b>
        </Text>
        <Input name="account_" size="lg" placeholder="0x or .eth"></Input>

        <Text>
          <b>Shares</b>
        </Text>
        <NumInputField name="amount_" />

        <Text>
          <b>Tribute (ETH)</b>
        </Text>
        <NumInputField name="assetAmount_" min=".000000000000000001" />

        <Input type="hidden" name="proposalType_" value="0" />

        <Button type="submit">Submit Proposal</Button>
      </Stack>
    </form>
  );
}
