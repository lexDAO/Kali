/* eslint-disable react/no-children-prop */
import React, { Component } from "react";
import {
  chakra,
  Input,
  Button,
  Stack,
  Text,
  Textarea,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";

class ProposeMember extends Component {
  render() {
    return (
      <React.Fragment>
        <form onSubmit={this.props.submitProposal}>
          <Stack spacing={3}>
            <Input type="hidden" name="dao" value={this.props.dao["address"]} />
            <Input type="hidden" name="proposalType" value={0} />
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
            <Input name="payload" type="hidden" value="0x"></Input>
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
              Submit Proposal
            </Button>
          </Stack>
        </form>
      </React.Fragment>
    );
  }
}

export default ProposeMember;
