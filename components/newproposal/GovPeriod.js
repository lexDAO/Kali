import { useState, useContext, useEffect } from 'react';
import AppContext from '../../context/AppContext';
import {
  Input,
  Select,
  Text,
  HStack
} from "@chakra-ui/react";
import NumInputField from "../elements/NumInputField";
import { votingPeriodUnits } from "../../utils/appParams";
import { convertVotingPeriod } from "../../utils/helpers";

export default function GovPeriod() {
  const value = useContext(AppContext);
  const { web3, loading, account, abi, address, dao } = value.state;

  return (
    <>
    <Text>Voting Period (currently {convertVotingPeriod(dao['votingPeriod'])}):</Text>
      <HStack>
        <NumInputField name="period_" />
        <Select name="unit_">
          {votingPeriodUnits.map((v, index) => (
            <option key={index} value={v}>{v}</option>
          ))}
        </Select>
      </HStack>
    </>
  );
}
