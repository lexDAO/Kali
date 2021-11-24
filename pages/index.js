/* eslint-disable react/no-children-prop */
import React, { Component } from "react";
import { ChakraProvider, Container } from "@chakra-ui/react";
import factory from "../eth/factory.js";
import web3 from "../eth/web3.js";
import Router, { useRouter } from "next/router";
import Layout from "../components/Layout.js";
import {
  Flex,
  Input,
  Button,
  Text,
  Textarea,
  Stack,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Select,
  InputGroup,
  InputRightAddon,
} from "@chakra-ui/react";

class Factory extends Component {
  state = {
    loading: false,
    account: null,
  };

  async componentDidMount() {
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];
    this.setState({ account });
  }

  createDAO = async (e) => {
    e.preventDefault();
    this.setState({ loading: true });
    let object = e.target;
    var array = [];
    for (let i = 0; i < object.length; i++) {
      array[object[i].name] = object[i].value;
    }
    console.log(array);
    var {
      name,
      symbol,
      voters,
      shares,
      votingPeriod,
      quorum,
      supermajority,
      mint,
      burn,
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

    console.log(votingPeriod);

    const accounts = await web3.eth.getAccounts();
    console.log(accounts[0]);

    try {
      let result = await factory.methods
        .deployKaliDAO(
          name,
          symbol,
          true,
          voters.split(","),
          sharesArray,
          votingPeriod,
          quorum,
          supermajority,
          mint,
          burn,
          call,
          gov
        )
        .send({ from: accounts[0] });

      let dao = result["events"]["DAOdeployed"]["returnValues"]["kaliDAO"];

      Router.push({
        pathname: "/daos",
        query: { dao: dao },
      });
    } catch (e) {
      alert(e);
      console.log(e);
    }
    this.setState({ loading: false });
  };

  render() {
    return (
      <Layout loading={this.state.loading}>
        <Stack
          display="flex"
          flexDirection="column"
          as="form"
          bgGradient="linear(to-br, kali.200, kali.100)"
          p={5}
          color="kali.900"
          fontSize="l"
          letterSpacing="wide"
          lineHeight="tight"
          boxShadow="xs"
          rounded="xl"
          onSubmit={this.createDAO}
        >
          <Text>
            <b>Name</b>
          </Text>
          <Input name="name" placeholder="KaliDAO"></Input>
          <Text>
            <b>Symbol</b>
          </Text>
          <Input name="symbol" placeholder="KALI"></Input>
          <Text>
            <b>Founders</b>
          </Text>
          <Textarea name="voters" placeholder="0xabc, 0xdef, 0xghi" />
          <Text>
            <b>Shares</b>
          </Text>
          <Textarea name="shares" placeholder="1, 2, 3" />
          <Text>
            <b>Voting Period</b>
          </Text>
          <NumberInput defaultValue={3} name="votingPeriod">
            <NumberInputField focusBorderColor="red.200" />
            <NumberInputStepper>
              <NumberIncrementStepper
                bg="green.200"
                _active={{ bg: "green.300" }}
                children="+"
              />
              <NumberDecrementStepper
                bg="pink.200"
                _active={{ bg: "pink.300" }}
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
            <option value="days">Days</option>
            <option value="weeks">Weeks</option>
          </Select>
          <Text>
            <b>Quorum %</b>
          </Text>
          <NumberInput defaultValue={10} min={0} max={100} name="quorum">
            <NumberInputField focusBorderColor="red.200" />
            <NumberInputStepper>
              <NumberIncrementStepper
                bg="green.200"
                _active={{ bg: "green.300" }}
                children="+"
              />
              <NumberDecrementStepper
                bg="pink.200"
                _active={{ bg: "pink.300" }}
                children="-"
              />
            </NumberInputStepper>
          </NumberInput>
          <Input type="hidden" name="supermajority" value={60} />
          <Input type="hidden" name="mint" value={1} />
          <Input type="hidden" name="burn" value={3} />
          <Input type="hidden" name="call" value={1} />
          <Input type="hidden" name="gov" value={3} />
          <br></br>
          <Button
            display="flex"
            justifyContent="center"
            alignItem="center"
            colorScheme="kali"
            size="md"
            variant="outline"
            _hover={{
              color: "kali.500",
            }}
            type="submit"
          >
            Summon
          </Button>
        </Stack>
      </Layout>
    );
  }
}

export default Factory;
