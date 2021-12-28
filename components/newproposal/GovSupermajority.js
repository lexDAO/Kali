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
import NumInputField from "../elements/NumInputField";

export default function GovSupermajority() {
  const value = useContext(AppContext);
  const { web3, loading, account, abi, address, dao } = value.state;

  const submitProposal = async (event) => {
    event.preventDefault();
    value.setLoading(true);
    console.log(value);

    try {
      let object = event.target;
      var array = [];
      for (let i = 0; i < object.length; i++) {
        array[object[i].name] = object[i].value;
      }

      var { description_, amount_, proposalType_ } = array; // this must contain any inputs from custom forms

      var account_ = "0x0000000000000000000000000000000000000000";

      const payload_ = Array(0);

      const instance = new web3.eth.Contract(abi, address);

      try {
        let result = await instance.methods
          .propose(
            proposalType_,
            description_,
            [account_],
            [amount_],
            [payload_]
          )
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
        <Text>Supermajority (currently {dao["gov"]["supermajority"]}%):</Text>
        <NumInputField name="amount_" />
        <Input type="hidden" name="proposalType_" value="5" />
        <Button type="submit">Submit Proposal</Button>
      </Stack>
    </form>
  );
}
