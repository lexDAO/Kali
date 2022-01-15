import { Button, Box, Text, VStack, HStack, Image, Divider } from "@chakra-ui/react";
import ContactForm from "../elements/ContactForm";
import FlexGradient from "../elements/FlexGradient";
import KaliButton from "../elements/KaliButton";

export default function HomeTile(props) {
  return (
    <FlexGradient>
      <HStack spacing={5} p={5} alignItems="center">

        <VStack>
          <Text fontSize="xl">
            <b>Launch a limited liability DAO</b>
          </Text>
          <Text fontSize="md">
            <i>form an LLC or UNA in minutes</i>
          </Text>
          <KaliButton onClick={props.setDeployerVisible}>Create DAO</KaliButton>
          {/* <ContactForm /> */}
        </VStack>
      </HStack>
    </FlexGradient>
  );
}
