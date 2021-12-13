import { useState, useContext, useEffect } from 'react';
import AppContext from '../../context/AppContext';
import {
  Text,
  HStack,
  Input
} from "@chakra-ui/react";
import NumInputField from "../elements/NumInputField";

export default function GovQuorum() {
  const value = useContext(AppContext);
  const { web3, loading, account, abi, address, dao } = value.state;

  return (
    <>
    <Text>Quorum (currently {dao['quorum']}%):</Text>
      <HStack>
        <NumInputField name="amount_" />
      </HStack>
    </>
  );
}
