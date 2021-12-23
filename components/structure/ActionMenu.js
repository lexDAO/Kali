import { useContext } from "react";
import AppContext from "../../context/AppContext";
import { BrowserView, MobileView } from "react-device-detect";
import {
  Flex,
  Button,
  Spacer,
  Center,
  HStack,
  IconButton,
} from "@chakra-ui/react";

const ActionButton = (props) => {
  return (
    <Button
      onClick={props.onClick}
      size="sm"
      backgroundColor={props.backgroundColor}
      border="0px"
    >
      {props.children}
    </Button>
  );
};
const active = "red";
const inactive = "white";

export default function ActionMenu(props) {
  const value = useContext(AppContext);
  const { web3, loading, abi, visibleView } = value.state;

  const handleClick = (id) => {
    value.setVisibleView(id);
  };

  return (
    <Center>
      <HStack p={5} backgroundColor="lightgrey" rounded="md" m={3} p={3}>
        <ActionButton
          onClick={() => handleClick(1)}
          backgroundColor={visibleView == 1 ? active : inactive}
        >
          Dashboard
        </ActionButton>
        <ActionButton
          onClick={() => handleClick(2)}
          backgroundColor={visibleView == 2 ? active : inactive}
        >
          Proposals
        </ActionButton>
        <ActionButton
          onClick={() => handleClick(3)}
          backgroundColor={visibleView == 3 ? active : inactive}
        >
          New Proposal
        </ActionButton>
      </HStack>
    </Center>
  );
}
