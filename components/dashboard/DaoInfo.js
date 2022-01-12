import { useState, useContext, useEffect } from "react";
import AppContext from "../../context/AppContext";
import { Text, HStack, Link, Icon, Button, Divider, Spacer, Center } from "@chakra-ui/react";
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
import { fromDecimals } from "../../utils/formatters";
import DashedDivider from "../elements/DashedDivider";

export default function DaoInfo() {
  const value = useContext(AppContext);
  const { dao } = value.state;
  const { isOpen, onOpen, onClose } = useDisclosure()

  const array = [
    {
      name: "Name",
      info: dao['name'],
      link: null
    },
    {
      name: "Address",
      info: dao['address'],
      link: `https://rinkeby.etherscan.io/address/${dao["address"]}`
    },
    {
      name: "Symbol",
      info: dao['token']['symbol'],
      link: null
    },
    {
      name: "Shares",
      info: fromDecimals(dao['token']['totalSupply'], 18),
      link: null
    },
    {
      name: "Docs",
      info: dao['docs'],
      link: `${dao["docs"]}`
    },
    {
      name: "Members",
      info: dao['members'].length,
      link: null
    }
  ]

  return(
    <div>
    {array.map((item, index) => (
      <>
      {item.info != undefined ?
        <>
      <HStack>
        <Text>{item.name}</Text>
        <Spacer />
        <Text>{item.info}</Text>
        {item.link != null ?
        <Link
          passHref
          href={item.link}
        >
          <Icon as={BsFillArrowUpRightSquareFill} />
        </Link>
        : null}
      </HStack>
      <DashedDivider />
      </>
      : null}
      </>
    ))}
    <Center>
      <Button className="transparent-btn" onClick={onOpen}>View Cap Table</Button>
    </Center>
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
  </div>
  );
}
