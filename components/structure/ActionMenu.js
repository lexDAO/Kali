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
export default function ActionMenu(props) {
  const value = useContext(AppContext);
  const { web3, loading, abi, reload, visibleView } = value.state;

  return(
    <Center>
      <HStack p={5}>
        <Button size="sm" onClick={() => value.setVisibleView(1)}>Proposals</Button>
        <Button size="sm" onClick={() => value.setVisibleView(2)}>New Proposal</Button>
        <Button size="sm" onClick={() => value.setVisibleView(3)}>DAO Info</Button>
        <IconButton size="sm" aria-label='refresh' icon={<BiRefresh />} onClick={value.reloadButton} />
      </HStack>
    </Center>
  )
}
