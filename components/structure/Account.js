import { useContext } from 'react';
import AppContext from '../../context/AppContext';
import {
  Button,
  Text
} from "@chakra-ui/react";

export default function Account() {
  const value = useContext(AppContext);
  const { account } = value.state;
  let display;
  if(account) {
    display = account.substr(0, 5) + '...' + account.substr(account.length-4, account.length);
  }
  return(
    <Button
      flexShrink={0}
      bgGradient="linear(to-br, kali.600, kali.700)"
      //display={{sm: "none", md: "block", lg: "block", xl: "block"}}
      variant="ghost"
      color="white"
      mr={2}
      border={0}
      onClick={value.connect}
    >
      <Text maxW="xs">{account == null ? "Connect" : display}</Text>
    </Button>
  )
}
