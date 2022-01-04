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
            Launch and automate your business with real DAO magick.
          </Text>
          <Text>Lorem ipsum dolor sit amet, sea persius accumsan id.</Text>
          <Text>Veniam primis indoctum ne mei, ne corpora recusabo usu, postea tincidunt te sed.</Text>
          <Button onClick={props.setDeployerVisible}>Create your DAO</Button>
          {/* <ContactForm /> */}
        </Stack>
      </HStack>
    </FlexGradient>
  );
}
