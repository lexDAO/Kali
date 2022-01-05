import { useState, useContext, useEffect } from "react";
import AppContext from "../../context/AppContext";
import { Text, HStack, Link, Icon, UnorderedList, ListItem, Button } from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'
import { BsFillArrowUpRightSquareFill } from "react-icons/bs";
import { useDisclosure } from "@chakra-ui/react";
import CapTable from "./CapTable";

export default function DaoInfo() {
  const value = useContext(AppContext);
  const { dao } = value.state;
  const { isOpen, onOpen, onClose } = useDisclosure()

  return(
    <>
    <UnorderedList>
    <ListItem>Name: {dao["name"]}</ListItem>
    <ListItem>
      <Text>{dao["address"]}</Text>
      <Link
        passHref
        href={`https://rinkeby.etherscan.io/address/${dao["address"]}`}
      >
        <Icon as={BsFillArrowUpRightSquareFill} />
      </Link>
    </ListItem>
    <ListItem>Symbol: {dao["token"]["symbol"]}</ListItem>
    <ListItem>
      Shares: {dao["token"]["totalSupply"] / 1000000000000000000}{" "}
    </ListItem>
    {dao['docs'] != undefined ?
    <>
    <ListItem>
      <Text>Docs: {dao["docs"]}</Text>
      <Link href={`${dao["docs"]}`}>
        <Icon as={BsFillArrowUpRightSquareFill} />
      </Link>
    </ListItem>
    </>
    : null}
    <ListItem>Members: {dao["members"].length}</ListItem>
    </UnorderedList>
    <Button onClick={onOpen}>View Cap Table</Button>
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>Cap Table</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <CapTable />
      </ModalBody>

      <ModalFooter>
        <Button colorScheme='blue' mr={3} onClick={onClose}>
          Close
        </Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
  </>
  );
}
