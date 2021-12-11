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

export default function ProposalType0() {

  return (
    <>
      <Text><b>Details</b></Text>

      <Textarea name="description" size="lg" placeholder=". . ." />
      <Text><b>Recipient</b></Text>

      <Input name="account_" size="lg" placeholder="0x or .eth"></Input>
      <Text><b>Shares</b></Text>

      <NumberInput name="amount" size="lg" defaultValue={1} min={1}>

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
      
      <Input name="payload" type="hidden" value="0x"></Input>
    </>
  );
}
