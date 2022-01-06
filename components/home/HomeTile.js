import { Button, Box, Text, Stack, HStack, Image, Divider } from "@chakra-ui/react";
import ContactForm from "../elements/ContactForm";
import FlexGradient from "../elements/FlexGradient";

export default function HomeTile(props) {
  return (
    <FlexGradient>
      <HStack spacing={5} p={5} alignItems="center">
        <Box size="lg"><Image src='https://i.pinimg.com/564x/ba/3f/f9/ba3ff9c3fef67713d3e6b8141a7e3155.jpg' /></Box>
        <Stack>
          <Text fontSize="xl">
            Launch a limited liability DAO
          </Text>
          <Button onClick={props.setDeployerVisible}>Begin</Button>
          {/* <ContactForm /> */}
        </Stack>
      </HStack>
    </FlexGradient>
  );
}
