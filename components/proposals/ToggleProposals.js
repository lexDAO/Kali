import { chakra, Box, Button, Text, Center } from "@chakra-ui/react";

export default function ToggleProposals(props) {

  let toggle = props.toggle;
  const on = "red";
  const off = "white";

  return (
    <Center
      border="1px solid"
      p={2}
    >
      <Button
        onClick={() => props.handleClick('active')}
        backgroundColor={toggle=='active' ? on : off }
      >
        Active
      </Button>
      <Button
        onClick={() => props.handleClick('pending')}
        backgroundColor={toggle=='pending' ? on : off }
      >
        Unsponsored
      </Button>
    </Center>
  );
}
