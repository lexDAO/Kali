import { useState, useContext, useEffect } from "react";
import AppContext from "../../context/AppContext";
import {
  Textarea,
  Button,
  Input,
  Select,
  Text,
  HStack,
  Stack,
} from "@chakra-ui/react";
import { proposalTypes, voteTypes } from "../../constants/params";

export default function GovVotingSettings() {
  const value = useContext(AppContext);
  const { web3, loading, account, abi, address, dao } = value.state;

  const submitProposal = async (event) => {
    event.preventDefault();
    value.setLoading(true);

    try {
      let object = event.target;
      var array = [];
      for (let i = 0; i < object.length; i++) {
        array[object[i].name] = object[i].value;
      }

      var { description_, pType_, vType_, proposalType_ } = array; // this must contain any inputs from custom forms
      console.log(array);
      var account_ = Array(
        "0x0000000000000000000000000000000000000000",
        "0x0000000000000000000000000000000000000000"
      );
      console.log(account_);
      var amount_ = Array(parseInt(pType_), parseInt(vType_));
      console.log("amount");
      console.log(amount_);

      const payload_ = Array("0x", "0x");
      console.log(payload_);
      const instance = new web3.eth.Contract(abi, address);

      try {
        let result = await instance.methods
          .propose(proposalType_, description_, account_, amount_, payload_)
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
        <Text>
          <b>Details</b>
        </Text>
        <Textarea name="description_" size="lg" placeholder=". . ." />
        <HStack>
          <Select name="pType_">
            {Object.entries(proposalTypes).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </Select>
          <Select name="vType_">
            {Object.entries(voteTypes).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </Select>
        </HStack>
        <Input type="hidden" name="proposalType_" value="6" />
        <Button type="submit">Submit Proposal</Button>
      </Stack>
    </form>
  );
}
