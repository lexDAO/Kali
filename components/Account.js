import { useContext } from 'react';
import AppContext from '../context/AppContext';
import {
  Button,
  Text
} from "@chakra-ui/react";

export default function Account() {
  const value = useContext(AppContext);
  const { account } = value.state;
  return(
    <Button
      flexShrink={0}
      bgGradient="linear(to-br, kali.600, kali.700)"
      size="md"
      variant="ghost"
      color="white"
      mr={2}
      border={0}

    >
      <Text isTruncated maxW="sm">{account == null ? "Connect Wallet" : account}</Text>
    </Button>
  )
}
