import React, { useState, useContext, useEffect } from "react";
import AppContext from "../../context/AppContext";
import {
  Flex,
  VStack,
  HStack,
  Button,
  Input,
  Text,
  Select,
} from "@chakra-ui/react";
import NumInputField from "../elements/NumInputField";
import { supportedChains } from "../../constants/supportedChains";
import { getNetworkName, convertVotingPeriod } from "../../utils/formatters";
import { presets } from "../../constants/presets";
import { extensionDescriptions } from "../../constants/extensionsHelper";
import CustomSlider from "../elements/CustomSlider";

export default function Customized(props) {
  const value = useContext(AppContext);
  const { web3, chainId, loading, account } = value.state;
  const [votingPeriodUnit, setVotingPeriodUnit] = useState(null);
  const [votingPeriod, setVotingPeriod] = useState(null);

  useEffect(() => {
    let converted = convertVotingPeriod(props.details["votingPeriod"]);
    console.log(converted);
    let value = parseInt(converted.split(" ")[0]);
    console.log(value);
    setVotingPeriod(value);
    if (converted.includes("min")) {
      setVotingPeriodUnit(0);
    } else if (converted.includes("min")) {
      setVotingPeriodUnit(1);
    } else {
      setVotingPeriodUnit(2);
    }
  }, []);

  const changeVotingPeriodUnit = (e) => {
    let unit = e.target.value;
    setVotingPeriodUnit(unit);
    calculateVotingPeriod(votingPeriod, unit);
  };

  const changeVotingPeriod = (num) => {
    setVotingPeriod(num);
    calculateVotingPeriod(num, votingPeriodUnit);
  };

  const calculateVotingPeriod = (period, unit) => {
    let seconds;
    if (unit == 0) {
      seconds = period * 60;
    } else if (unit == 1) {
      seconds = period * 60 * 60;
    } else if (unit == 2) {
      seconds = period * 60 * 60 * 24;
    }
    let array = props.details;
    array["votingPeriod"] = seconds;
    props.setDetails(array);
    console.log(seconds);
  };

  const changeQuorum = (num) => {
    let array = props.details;
    array["quorum"] = parseInt(num);
    props.setDetails(array);
    console.log(props.details);
  };

  const changeSupermajority = (num) => {
    let array = props.details;
    array["supermajority"] = parseInt(num);
    props.setDetails(array);
    console.log(props.details);
  };

  const changePaused = (e) => {
    let array = props.details;
    array["paused"] = e.target.value;
    props.setDetails(array);
    console.log(props.details);
  };

  return (
    <VStack>
      <Text fontSize="xl">
        <b>Customize your governance</b>
      </Text>
      <Text>
        <b>Voting Period</b>
      </Text>
      <HStack>
        <NumInputField defaultValue={1} min="1" onChange={changeVotingPeriod} />
        <Select
          defaultValue={votingPeriodUnit}
          onChange={changeVotingPeriodUnit}
        >
          <option value="0">min</option>
          <option value="1">hours</option>
          <option value="2">days</option>
        </Select>
      </HStack>
      <Text>
        <b>Quorum</b>
      </Text>
      <CustomSlider
        label="quorum-slider"
        defaultValue={props.details["quorum"]}
        onChangeEnd={changeQuorum}
      />
      <Text>
        <b>Supermajority</b>
      </Text>
      <CustomSlider
        label="supermajority-slider"
        defaultValue={props.details["supermajority"]}
        onChangeEnd={changeSupermajority}
        min={51}
      />
      <Text>
        <b>Share Transferability</b>
      </Text>
      <Select defaultValue={props.details["paused"]} onChange={changePaused}>
        <option value="1">Transferable</option>
        <option value="0">Nontransferable</option>
      </Select>
      <Button onClick={() => props.handleNext()}>Next</Button>
    </VStack>
  );
}
