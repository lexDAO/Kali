import { chakra, Box, Button, Text, Center } from "@chakra-ui/react";

export default function ToggleProposals(props) {
  let toggle = props.toggle;

  return (
    <Center border="1px solid" p={2}>
      <Button
        onClick={() => props.handleClick("active")}
        backgroundColor={toggle == "active" ? "kali.700" : "kali.900"}
        color="kali.800"
      >
        Active
      </Button>
      <Button
        onClick={() => props.handleClick("pending")}
        backgroundColor={toggle == "pending" ? "kali.700" : "kali.900"}
        color="kali.800"
      >
        Unsponsored
      </Button>
    </Center>
  );
}
