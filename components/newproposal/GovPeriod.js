import { useState, useContext, useEffect } from 'react';
import AppContext from '../../context/AppContext';
import {
  Textarea,
  Button,
  Input,
  Select,
  Text,
  HStack,
  Stack
} from "@chakra-ui/react";
import NumInputField from "../elements/NumInputField";
import { votingPeriodUnits } from "../../utils/appParams";
import { convertVotingPeriod } from "../../utils/helpers";
import { alertMessage, votingPeriodToSeconds } from "../../utils/helpers";

export default function GovPeriod() {
  const value = useContext(AppContext);
  const { web3, loading, account, abi, address, dao } = value.state;

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
          proposalType_,
          period_,
          unit_
        } = array; // this must contain any inputs from custom forms
        console.log(array)
        var account_ = "0x0000000000000000000000000000000000000000";

        var amount_ = votingPeriodToSeconds(period_, unit_);
        console.log(amount_)

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
        <Text>Voting Period (currently {convertVotingPeriod(dao['votingPeriod'])}):</Text>
        <HStack>
          <NumInputField name="period_" />
          <Select name="unit_">
            {votingPeriodUnits.map((v, index) => (
              <option key={index} value={v}>{v}</option>
            ))}
          </Select>
        </HStack>
        <Input type="hidden" name="proposalType_" value="3" />
        <Button type="submit">Submit Proposal</Button>
      </Stack>
    </form>
  );
}
