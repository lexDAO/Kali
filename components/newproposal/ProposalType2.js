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

export default function ProposalType2() {

  return (
    <>
      <Text><b>Details</b></Text>
      <Textarea name="description" size="lg" placeholder=". . ." />
      <Text><b>Target</b></Text>
      <Input name="account_" size="lg" placeholder="0x"></Input>
      <Input name="amount" type="hidden" value={0} />
      <Text><b>Payload</b></Text>
      <Input name="payload" size="lg" placeholder="0x"></Input>
    </>
  );
}
