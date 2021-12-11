import { useState, useContext, useEffect } from 'react';
import Router, { useRouter } from "next/router";
import AppContext from '../../context/AppContext';
import {
  Input,
  Button,
  Select,
  Text,
  Textarea,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";
import { tokenBalances } from '../../utils/tokens';

export default function ProposalType3(props) {
  const value = useContext(AppContext);
  const { web3, loading, account, abi, address } = value.state;
  const balances = props.balances;
  return (
    <>
      <Text><b>Details</b></Text>
      <Textarea name="description" size="lg" placeholder=". . ." />
      <Text><b>Recipient</b></Text>
      <Input name="recipient" size="lg" placeholder="0x or .eth"></Input>
      <Text><b>Token</b></Text>
      <Select
        name="account_"
        color="kali.800"
        bg="kali.900"
        opacity="0.9"
      >
        {balances.map((b, index) => (

          <option key={index} value={b['address']}>{b['token']} (balance: {web3.utils.fromWei(b['balance'])})</option>
        ))}
      </Select>
      <Text>
        <b>Amount</b>
      </Text>
      <NumberInput name="tokenAmount" size="lg" defaultValue={1} min={1}>
        <NumberInputField focusBorderColor="red.200" />
        <NumberInputStepper>
          <NumberIncrementStepper
            bg="green.600"
            _active={{ bg: "green.500" }}
            children="+"
          />
          <NumberDecrementStepper
            bg="red.600"
            _active={{ bg: "red.500" }}
            children="-"
          />
        </NumberInputStepper>
      </NumberInput>
    </>
  );
}
