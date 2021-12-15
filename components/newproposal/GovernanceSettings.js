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
import NumInputField from "../elements/NumInputField";
import { govSettingsHelper } from "../../utils/newProposalHelper";
import { votingPeriodToSeconds } from "../../utils/helpers";

export default function GovernanceSettings() {
  const value = useContext(AppContext);
  const { web3, loading, account, abi, address } = value.state;
  const [propType, setPropType] = useState(999); // arbitrary high number, do not change

  const updatePropType = (e) => {
    let newValue = e.target.value;
    setPropType(newValue);
  };

  const submitProposal = async (event) => {
    event.preventDefault();
    value.setLoading(true);
    console.log(value)
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
          description_,
          account_,
          amount_,
          proposalType_,
          period_,
          unit_,
          pType_,
          vType_
        } = array; // this must contain any inputs from custom forms
        console.log(array)
        account_ = "0x0000000000000000000000000000000000000000";

        if(proposalType_==3) {
          amount_ = votingPeriodToSeconds(period_, unit_);
          console.log(amount_);
        }
        if(proposalType_==6) {
          alert("Still working on this one");
        }

        const payload_ = Array(0);

        const instance = new web3.eth.Contract(abi, address);

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

      <Text><b>Setting to Adjust</b></Text>

      <Select name="proposalType_" onChange={updatePropType}>
        <option value="999">Select</option>
        {govSettingsHelper.map((g, index) => (
          <option key={index} value={g[0]}>{g[1]}</option>
        ))}
      </Select>

      {govSettingsHelper.map((g, index) => (
        propType==g[0] ? g[2] : null
      ))}
      <Button type="submit">Submit Proposal</Button>
    </Stack>
    </form>
  );
}
