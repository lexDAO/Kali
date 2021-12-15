import { useState, useContext, useEffect } from 'react';
import AppContext from '../../context/AppContext';
import {
  Text,
  HStack,
  Input
} from "@chakra-ui/react";
import NumInputField from "../elements/NumInputField";

export default function GovPause() {
  const value = useContext(AppContext);
  const { web3, loading, account, abi, address, dao } = value.state;

  return (
    <>
    <Text>{dao['paused']==true ? "Unpause" : "Pause"}</Text>
    <Input type="hidden" name="amount_" value="0" />
    </>
  );
}
