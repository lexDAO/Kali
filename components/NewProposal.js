/* eslint-disable react/no-children-prop */
import React, { Component } from "react";
import Router, { useRouter } from "next/router";
import web3 from "../eth/web3.js";
const abi = require("../abi/KaliDAO.json");

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

class NewProposal extends Component {
  state = {
    proposalType: 999, // arbitrary number where no proposal type is selected. if changed, must change below, too.
  };

  submitProposal = async (event) => {
    event.preventDefault();
    this.props.toggleLoading();

    let object = event.target;
    var array = [];
    for (let i = 0; i < object.length; i++) {
      array[object[i].name] = object[i].value;
    }

    var { dao, proposalType, description, account, amount, payload } = array;

    const instance = new web3.eth.Contract(abi, dao);

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

    this.props.toggleLoading();
  };

  updateProposalType = (e) => {
    let proposalType = e.target.value;
    this.setState({ proposalType });
  };

  render() {
    return (
      <React.Fragment>
        <form onSubmit={this.submitProposal}>
          <FlexOutline>
            <Input type="hidden" name="dao" value={this.props.dao["address"]} />
            <Select
              name="proposalType"
              onChange={this.updateProposalType}
              color="kali.800"
              bg="kali.900"
              opacity="0.9"
            >
              <option value="999">Select a proposal type</option>
              <option value="0">Mint</option>
              <option value="1">Burn</option>
              <option value="2">Call</option>
            </Select>

            {this.state.proposalType == 0 ? <Fields_0 /> : ""}
            {this.state.proposalType == 1 ? <Fields_1 /> : ""}
            {this.state.proposalType == 2 ? <Fields_2 /> : ""}
            {this.state.proposalType != 999 ? (
              <Button type="submit">Submit Proposal</Button>
            ) : (
              ""
            )}
          </FlexOutline>
        </form>
      </React.Fragment>
    );
  }
}

export default NewProposal;

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
      <Input name="account" size="lg" placeholder="0x"></Input>
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
      <Input name="account" size="lg" placeholder="0x"></Input>
      <Input name="amount" type="hidden" value="0" />
      <Input name="payload" type="hidden" value="0x"></Input>
    </>
  );
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
  );
};
