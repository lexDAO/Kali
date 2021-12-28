import { useContext } from "react";
import AppContext from "../../context/AppContext";
import { Button, Text } from "@chakra-ui/react";
import { truncateAddress } from "../../utils/formatters";

export default function Account(props) {
  const value = useContext(AppContext);
  const { account } = value.state;

  return (
    <Button
      flexShrink={0}
      bgGradient="linear(to-br, kali.600, kali.700)"
      //display={{sm: "none", md: "block", lg: "block", xl: "block"}}
      variant="ghost"
      color="white"
      mr={2}
      border={0}
      {...props}
      onClick={value.connect}
    >
      <Text maxW="xs">
        {account == null ? "Connect" : truncateAddress(account)}
      </Text>
    </Button>
  );
}
