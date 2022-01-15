import { chakra, Box, Button, Text, HStack, Link, Spacer, Divider } from "@chakra-ui/react";
import Reload from "../elements/Reload";

export default function ToggleProposals(props) {
  let toggle = props.toggle;

  return (
    <HStack>
      <Spacer />
      <Button
        onClick={() => props.handleClick("active")}
        color={toggle == "active" ? "black" : "#cccccc"}
        variant="link"
        border="0"
      >
        Active
      </Button>
      <Divider orientation="vertical" border="1px" height="20px" borderColor="#cccccc" />
      <Button
        onClick={() => props.handleClick("pending")}
        color={toggle == "pending" ? "black" : "#cccccc"}
        variant="link"
        border="0"
      >
        Unsponsored
      </Button>
      <Divider orientation="vertical" border="1px" height="20px" borderColor="#cccccc" />
      <Reload reload={props.reloadProposals} />
    </HStack>
  );
}
