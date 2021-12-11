import { useContext } from 'react';
import AppContext from '../../context/AppContext';
import {BrowserView, MobileView} from 'react-device-detect';
import {
  Flex,
  Button,
  Spacer,
  Center,
  HStack,
  IconButton
} from "@chakra-ui/react";
import { BiRefresh } from "react-icons/bi";

const ActionButton = (props) => {
  return(
    <Button
      onClick={props.onClick}
      size="sm"
      backgroundColor={props.backgroundColor}
      border="0px"
    >
      {props.children}
    </Button>
  );
}
const active = "red";
const inactive = "white";

export default function ActionMenu(props) {
  const value = useContext(AppContext);
  const { web3, loading, abi, reload, visibleView } = value.state;

  return(
    <Center>
      <HStack p={5} backgroundColor="lightgrey" rounded="md" m={3} p={3}>
        <ActionButton onClick={() => value.setVisibleView(1)} backgroundColor={visibleView==1 ? active : inactive }>Proposals</ActionButton>
        <ActionButton onClick={() => value.setVisibleView(2)} backgroundColor={visibleView==2 ? active : inactive }>New Proposal</ActionButton>
        <ActionButton onClick={() => value.setVisibleView(3)} backgroundColor={visibleView==3 ? active : inactive }>DAO Info</ActionButton>
        <IconButton border="0px" size="sm" aria-label='refresh' icon={<BiRefresh />} onClick={value.reloadButton} />
      </HStack>
    </Center>
  )
}
