import { Center, Spinner } from "@chakra-ui/react";

export default function LoadingIndicator() {
  return (
    <Center
      position="absolute"
      width="100vw"
      height="100vh"
      backgroundColor="grey"
      opacity=".4"
    >
      <Spinner size="xl" />
    </Center>
  );
}
