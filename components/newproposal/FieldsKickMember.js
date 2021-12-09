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

export default function FieldsKickMember() {

  return (
    <>
      <Text>
        <b>Details</b>
      </Text>
      <Textarea name="description" size="lg" placeholder=". . ." />
      <Text>
        <b>Address to Kick</b>
      </Text>
      <Input name="account" size="lg" placeholder="0x or .eth"></Input>
      <Input name="amount" type="hidden" value="0" />
      <Input name="payload" type="hidden" value="0x"></Input>
    </>
  );
}
