import { Center, Flex, Spinner } from "@chakra-ui/react";

export default function LoadingIndicator() {
  return (
    <Center
      height="100vh"
      width="100vw"
      position="fixed"
      backgroundColor="grey"
      opacity="0.4"
    >
      <Spinner size="xl" color="kali.700" emptyColor="gray.200" />
    </Center>
  );
}
