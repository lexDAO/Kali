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

class ProposeKickMember extends Component {
  render() {
    return (
      <React.Fragment>
        <form onSubmit={this.props.submitProposal}>
          <Stack spacing={3}>
            <Input type="hidden" name="dao" value={this.props.dao["address"]} />
            <Input type="hidden" name="proposalType" value={1} />
            <Text>
              <b>Details</b>
            </Text>
            <Textarea name="description" size="lg" placeholder=". . ." />
            <Text>
              <b>Kicked</b>
            </Text>
            <Input name="account" size="lg" placeholder="0x"></Input>
            <Input name="amount" type="hidden" value="0" />
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

export default ProposeKickMember;
