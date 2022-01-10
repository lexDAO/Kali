import { Button, Box, Text, Stack, HStack, Image, Divider } from "@chakra-ui/react";
import ContactForm from "../elements/ContactForm";
import FlexGradient from "../elements/FlexGradient";

export default function HomeTile(props) {
  return (
    <FlexGradient>
      <HStack spacing={5} p={5} alignItems="center">
        
        <Stack>
          <Text fontSize="xl">
            <b>Launch a limited liability DAO</b>
          </Text>
          <Text fontSize="md">
            <i>form an LLC or UNA in minutes</i>
          </Text>
          <Button onClick={props.setDeployerVisible}>Begin</Button>
          {/* <ContactForm /> */}
        </Stack>
      </HStack>
    </FlexGradient>
  );
}
