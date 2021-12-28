import { useContext } from "react";
import AppContext from "../../context/AppContext";
import { Button, Text, Icon } from "@chakra-ui/react";
import { getNetworkName } from "../../utils/formatters";
import { IoIosGitNetwork } from "react-icons/io";

export default function Chain() {
  const value = useContext(AppContext);
  const { account, chainId, daoChain } = value.state;
  console.log(daoChain);
  console.log(chainId);
  let bg;
  if(chainId==daoChain) {
    bg="linear(to-br, kali.600, kali.700)";
  } else {
    bg="linear(to-br, grey, grey)";
  }

  return (
    <>
    {chainId == null ? null :

    <Button
      flexShrink={0}
      bgGradient={bg}
      //display={{sm: "none", md: "block", lg: "block", xl: "block"}}
      variant="ghost"
      color="white"
      mr={2}
      border={0}
    >
      <Icon as={IoIosGitNetwork} />
      <Text>{getNetworkName(chainId)}</Text>
    </Button>
    }
    </>
  );
}
