import { useState, useContext, useEffect } from 'react';
import Router, { useRouter } from "next/router";
import AppContext from '../../context/AppContext';
import {
  Select,
  Text,
  Stack
} from "@chakra-ui/react";
import NumInputField from "../elements/NumInputField";
import { govSettingsHelper } from "../../utils/newProposalHelper";
import { votingPeriodToSeconds } from "../../utils/helpers";
import { alertMessage } from "../../utils/helpers";

export default function GovernanceSettings() {
  const value = useContext(AppContext);
  const { web3, loading, account, abi, address } = value.state;
  const [propType, setPropType] = useState(999); // arbitrary high number, do not change

  const updatePropType = (e) => {
    let newValue = e.target.value;
    setPropType(newValue);
  };

  return (
      <>
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
      </>
  );
}
