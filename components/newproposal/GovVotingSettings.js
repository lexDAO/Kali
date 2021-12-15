import { useState, useContext, useEffect } from 'react';
import AppContext from '../../context/AppContext';
import {
  Text,
  HStack,
  Select
} from "@chakra-ui/react";
import { proposalTypes } from "../../utils/appParams";
import { voteTypes } from "../../utils/appParams";

export default function GovVotingSettings() {
  const value = useContext(AppContext);
  const { web3, loading, account, abi, address, dao } = value.state;

  return (
    <>
      <HStack>
        <Select name="pType_">
          {proposalTypes.map((t, index) => (
            <option key={index} value={index}>{t}</option>
          ))}
        </Select>
        <Select name="vType_">
          {voteTypes.map((v, index) => (
            <option key={index} value={index}>{v}</option>
          ))}
        </Select>
      </HStack>
    </>
  );
}
