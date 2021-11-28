import {
  Text,
  Container,
  Stack,
  Button,
  useColorModeValue,
} from "@chakra-ui/react";
import { BsTwitter, BsGithub } from "react-icons/bs";

export default function Footer() {
  return (
    <Container
      as={Stack}
      mt={5}
      maxW={"5xl"}
      py={4}
      direction={{ base: "column", md: "row" }}
      spacing={4}
      justify={{ base: "center", md: "space-between" }}
      align={{ base: "center", md: "center" }}
    >
      <Text fontSize="xs">
        Brought to you by{" "}
        <a href="https://twitter.com/lex_DAO" target="_blank" rel="noreferrer">
          <i>LexDAO</i>
        </a>
      </Text>
      <Stack direction={"row"} spacing={4}>
        <Button
          rounded={"full"}
          as={"a"}
          href={"https://twitter.com/_KaliDAO"}
          target="_blank"
          display={"inline-flex"}
          alignItems={"center"}
          justifyContent={"center"}
          transition={"background 0.3s ease"}
        >
          <BsTwitter />
        </Button>
        <Button
          rounded={"full"}
          as={"a"}
          href={"https://github.com/lexDAO/Kali"}
          target="_blank"
          display={"inline-flex"}
          alignItems={"center"}
          justifyContent={"center"}
          transition={"background 0.3s ease"}
        >
          <BsGithub />
        </Button>
      </Stack>
    </Container>
  );
}
