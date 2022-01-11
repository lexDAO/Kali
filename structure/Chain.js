import { useContext } from "react";
import AppContext from "../../context/AppContext";
import { Button, Text, Icon, Divider } from "@chakra-ui/react";
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

      <>
      <Button variant="link" id="nav-chainName">
        <Icon as={IoIosGitNetwork} id="nav-chainIcon" />
        {getNetworkName(chainId)}
        <Divider orientation="vertical" border="1px solid" />
      </Button>
      </>
    }
    </>
  );
}
