import { useState, useContext, useEffect } from 'react';
import Router, { useRouter } from "next/router";
import AppContext from '../context/AppContext';
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
import FlexOutline from "./FlexOutline";
import FlexGradient from "./FlexGradient";
import Layout from './Layout';
const abi = require("../abi/KaliDAO.json");

export default function NewProposal() {
  const [proposalType, setProposalType] = useState(999); // arbitrary number where no proposal type is selected. if changed, must change below, too

  const value = useContext(AppContext);
  const { web3, loading } = value.state;
  const router = useRouter();
  const address = router.query.dao;

  const submitProposal = async (event) => {
    event.preventDefault();
    value.setLoading(true);

    let object = event.target;
    var array = [];
    for (let i = 0; i < object.length; i++) {
      array[object[i].name] = object[i].value;
    }

    var { dao, proposalType, description, account, amount, payload } = array;

    const instance = new web3.eth.Contract(abi, dao);

    if (account.includes(".eth")) {
      account = await web3.eth.ens.getAddress(account).catch(() => {
        alert("ENS not found")
      });
    }

    if (proposalType == 1) {
      amount = await instance.methods.balanceOf(account).call();
    }

    // convert units to wei for mint proposals - this should be covered for burn per balanceOf
    if (proposalType == 0) {
      amount = web3.utils.toWei(amount);
    }

    try {
      const accounts = await web3.eth.getAccounts();

      let result = await instance.methods
        .propose(proposalType, description, [account], [amount], [payload])
        .send({ from: accounts[0] });

      Router.reload(window.location.pathname);
    } catch (e) {
      alert(e);
    }

    value.setLoading(false);
  };

  const updateProposalType = (e) => {
    let proposalType = e.target.value;
    setProposalType(proposalType);
  };

  return(
    <>
      <form onSubmit={submitProposal}>
        <FlexOutline>
          <Input type="hidden" name="dao" value={address} />
          <Select
            name="proposalType"
            onChange={updateProposalType}
            color="kali.800"
            bg="kali.900"
            opacity="0.9"
          >
            <option value="999">Select a proposal type</option>
            <option value="0">Mint</option>
            <option value="1">Burn</option>
            <option value="2">Call</option>
          </Select>

          {proposalType == 0 ? <Fields_0 /> : ""}
          {proposalType == 1 ? <Fields_1 /> : ""}
          {proposalType == 2 ? <Fields_2 /> : ""}
          {proposalType != 999 ? (
            <Button type="submit">Submit Proposal</Button>
          ) : (
            ""
          )}
        </FlexOutline>
      </form>
    </>
  )
}

const Fields_0 = () => {
  return (
    <>
      <Text>
        <b>Details</b>
      </Text>
      <Textarea name="description" size="lg" placeholder=". . ." />
      <Text>
        <b>Recipient</b>
      </Text>
      <Input name="account" size="lg" placeholder="0x or .eth"></Input>
      <Text>
        <b>Shares</b>
      </Text>
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
};

const Fields_1 = () => {
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
  )
};

const Fields_2 = () => {
  return (
    <>
      <Text>
        <b>Details</b>
      </Text>
      <Textarea name="description" size="lg" placeholder=". . ." />
      <Text>
        <b>Target</b>
      </Text>
      <Input name="account" size="lg" placeholder="0x"></Input>
      <Input name="amount" type="hidden" value={0} />
      <Text>
        <b>Payload</b>
      </Text>
      <Input name="payload" size="lg" placeholder="0x"></Input>
    </>
  )
};
