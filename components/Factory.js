/* eslint-disable react/no-children-prop */
import React, { Component } from "react";
import factory from "../eth/factory.js";
import web3 from "../eth/web3.js";
import Router, { useRouter } from "next/router";
import {
  Flex,
  Input,
  Button,
  Text,
  Textarea,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Select,
} from "@chakra-ui/react";
import FlexGradient from "./FlexGradient";

class Factory extends Component {
  state = {
    account: null,
  };

  static async getInitialProps() {
    const events = await factory.getPastEvents("DAOdeployed", {
      fromBlock: 0,
      toBlock: "latest",
    });
    const eventArray = [];
    for (let i = 0; i < events.length; i++) {
      let dao = events[i]["returnValues"];
      eventArray.push(dao);
    }
    return { eventArray };
  }

  createDAO = async (e) => {
    e.preventDefault();
    this.props.toggleLoading();
    let object = e.target;
    var array = [];
    for (let i = 0; i < object.length; i++) {
      array[object[i].name] = object[i].value;
    }
    console.log(array);
    var {
      name,
      symbol,
      docs,
      voters,
      shares,
      votingPeriod,
      quorum,
      supermajority,
      mint,
      call,
      gov,
      votePeriodUnit,
    } = array;
    console.log(array);
    // convert shares to wei
    var sharesArray = [];
    for (let i = 0; i < shares.split(",").length; i++) {
      sharesArray.push(web3.utils.toWei(shares.split(",")[i]));
    }

    // convert vote period to appropriate unit
    if (votePeriodUnit == "minutes") {
      votingPeriod *= 60;
    } else if (votePeriodUnit == "hours") {
      votingPeriod *= 60 * 60;
    } else if (votePeriodUnit == "days") {
      votingPeriod *= 60 * 60 * 24;
    } else if (votePeriodUnit == "weeks") {
      votingPeriod *= 60 * 60 * 24 * 7;
    }

    // convert docs to appropriate links
    if (docs == "COC") {
      docs =
        "https://github.com/lexDAO/LexCorpus/blob/master/contracts/legal/dao/membership/CodeOfConduct.md";
    } else if (docs == "UNA") {
      docs =
        "https://github.com/lexDAO/LexCorpus/blob/master/contracts/legal/dao/membership/TUNAA.md";
    } else if (docs == "LLC") {
      docs =
        "https://github.com/lexDAO/LexCorpus/blob/master/contracts/legal/dao/membership/operating/DelawareOperatingAgreement.md";
    }

    console.log(votingPeriod);

    const accounts = await web3.eth.getAccounts();
    console.log(accounts[0]);

    try {
      let result = await factory.methods
        .deployKaliDAO(
          name,
          symbol,
          docs,
          true,
          voters.split(","),
          sharesArray,
          votingPeriod,
          quorum,
          supermajority,
          mint,
          call,
          gov
        )
        .send({ from: accounts[0] });

      let dao = result["events"]["DAOdeployed"]["returnValues"]["kaliDAO"];

      Router.push({
        pathname: "/daos/[dao]",
        query: { dao: dao },
      });
    } catch (e) {
      alert(e);
      console.log(e);
    }
    this.props.toggleLoading();
  };

  render() {
    console.log(this.props.eventArray);

    return (
      <FlexGradient>
        <form onSubmit={this.createDAO}>
          <Text fontWeight="semibold">Name</Text>
          <Input name="name" placeholder="KaliDAO"></Input>
          <Text fontWeight="semibold">Symbol</Text>
          <Input name="symbol" placeholder="KALI"></Input>
          <Text fontWeight="semibold">Docs</Text>
          <Select name="docs" color="kali.800" bg="kali.900" opacity="0.90">
            <option value="COC">Code of Conduct</option>
            <option value="UNA">UNA</option>
            <option value="LLC">LLC</option>
          </Select>
          <Text fontWeight="semibold">Founders</Text>
          <Textarea name="voters" placeholder="0xabc, 0xdef, 0xghi" />
          <Text fontWeight="semibold">Shares</Text>
          <Textarea name="shares" placeholder="1, 2, 3" />
          <Text fontWeight="semibold">Voting Period</Text>
          <NumberInput defaultValue={3} name="votingPeriod">
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
          <Select
            name="votePeriodUnit"
            color="kali.800"
            bg="kali.900"
            opacity="0.90"
          >
            <option value="minutes">Minutes</option>
            <option value="hours">Hours</option>
            <option value="days" selected>
              Days
            </option>
            <option value="weeks">Weeks</option>
          </Select>
          <Text fontWeight="semibold">Quorum %</Text>
          <NumberInput defaultValue={10} min={0} max={100} name="quorum">
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
          <Input type="hidden" name="supermajority" value={60} />
          <Input type="hidden" name="mint" value={1} />
          <Input type="hidden" name="call" value={1} />
          <Input type="hidden" name="gov" value={3} />
          <br></br>
          <Button type="submit">Summon</Button>
        </form>
      </FlexGradient>
    );
  }
}

export default Factory;
