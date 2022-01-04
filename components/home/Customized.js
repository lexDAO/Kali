import React, { useState, useContext, useEffect } from "react";
import AppContext from "../../context/AppContext";
import { Flex, VStack, HStack, Button, Input, Text, Select } from "@chakra-ui/react";
import NumInputField from "../elements/NumInputField";
import { supportedChains } from "../../constants/supportedChains";
import { getNetworkName } from "../../utils/formatters";
import { presets } from "../../constants/presets";
import { extensionDescriptions } from "../../constants/extensionsHelper";

export default function Customized(props) {
  const value = useContext(AppContext);
  const { web3, chainId, loading, account } = value.state;
  const [votingPeriodUnit, setVotingPeriodUnit] = useState(0);
  const [votingPeriod, setVotingPeriod] = useState(1);

  const changeVotingPeriodUnit = (e) => {
    let unit = e.target.value;
    setVotingPeriodUnit(unit);
    calculateVotingPeriod(votingPeriod, unit);
  }

  const changeVotingPeriod = (num) => {
    setVotingPeriod(num);
    calculateVotingPeriod(num, votingPeriodUnit);
  }

  const calculateVotingPeriod = (period, unit) => {
    let seconds;
    if (unit == 0) {
      seconds = period * 60;
    } else if (unit == 1) {
      seconds = period *  60 * 60;
    } else if (unit == 2) {
      seconds = period * 60 * 60 * 24;
    }
    let array = props.details;
    array['votingPeriod'] = seconds;
    props.setDetails(array);
    console.log(seconds);
  }

  const changeQuorum = (num) => {
    let array = props.details;
    array['quorum'] = parseInt(num);
    props.setDetails(array);
    console.log(props.details)
  }

  const changeSupermajority = (num) => {
    let array = props.details;
    array['supermajority'] = parseInt(num);
    props.setDetails(array);
    console.log(props.details)
  }

  const changePaused = (e) => {
    let array = props.details;
    array['paused'] = e.target.value;
    props.setDetails(array);
    console.log(props.details)
  }

  return (
    <VStack>
        <Text>Customize your DAO&apos;s governance settings.</Text>
        <Text>Voting Period:</Text>
        <HStack>
        <NumInputField
          min="1"
          onChange={changeVotingPeriod} />
        <Select onChange={changeVotingPeriodUnit}>
          <option value="0">min</option>
          <option value="1">hours</option>
          <option value="2">days</option>
        </Select>
        </HStack>
        <Text>Quorum:</Text>
        <NumInputField
          min="0"
          max="100"
          onChange={changeQuorum} />
        <Text>Supermajority:</Text>
        <NumInputField
          min="51"
          max="100"
          onChange={changeSupermajority} />
        <Text>Share Transfer:</Text>
        <Select onChange={changePaused}>
          <option></option>
          <option value="1">Paused</option>
          <option value="0">Unpaused</option>
        </Select>
        <Button onClick={() => props.handleNext(4)}>Next</Button>
    </VStack>
  );
}
