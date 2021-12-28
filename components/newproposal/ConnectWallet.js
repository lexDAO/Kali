import { useContext } from "react";
import AppContext from "../../context/AppContext";
import { Center, Text, Button, VStack } from "@chakra-ui/react";

export default function ConnectWallet(props) {
  const value = useContext(AppContext);
  const { account } = value.state;

  return (
    <Center>
      <VStack>
      <Text>
        Please connect to your wallet provider to start making proposals.
      </Text>
      <Button onClick={value.connect}>Connect</Button>
      </VStack>
    </Center>
  );
}
