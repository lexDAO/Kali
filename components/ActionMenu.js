import {
  Flex,
  Button,
  Spacer,
  Center,
  HStack
} from "@chakra-ui/react";

export default function ActionMenu(props) {
  return(
    <Center>
      <HStack p={5}>
        <Button onClick={() => props.setVisible(1)}>Proposals</Button>
        <Button onClick={() => props.setVisible(2)}>New Proposal</Button>
      </HStack>
    </Center>
  )
}
