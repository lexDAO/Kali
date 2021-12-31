import { useContext } from "react";
import AppContext from "../../context/AppContext";
import { BrowserView, MobileView } from "react-device-detect";
import { Button, Center, HStack } from "@chakra-ui/react";

const ActionButton = (props) => {
  return (
    <Button
      onClick={props.onClick}
      size="sm"
      backgroundColor={props.backgroundColor}
      color="kali.800"
      border="0px"
    >
      {props.children}
    </Button>
  );
};

export default function ActionMenu(props) {
  const value = useContext(AppContext);
  const { visibleView } = value.state;

  const handleClick = (id) => {
    value.setVisibleView(id);
  };

  return (
    <Center>
      <HStack p={5} backgroundColor="lightgrey" rounded="md" m={3} p={3}>
        <ActionButton
          onClick={() => handleClick(1)}
          backgroundColor={visibleView == 1 ? "kali.700" : "kali.900"}
        >
          Dashboard
        </ActionButton>
        <ActionButton
          onClick={() => handleClick(2)}
          backgroundColor={visibleView == 2 ? "kali.700" : "kali.900"}
        >
          Proposals
        </ActionButton>
        <ActionButton
          onClick={() => handleClick(3)}
          backgroundColor={visibleView == 3 ? "kali.700" : "kali.900"}
        >
          New Proposal
        </ActionButton>
      </HStack>
    </Center>
  );
}
