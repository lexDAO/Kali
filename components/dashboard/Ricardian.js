import { useState, useContext, useEffect } from "react";
import AppContext from "../../context/AppContext";
import { Text, HStack, Link, Icon, UnorderedList, ListItem } from "@chakra-ui/react";
import { BsFillArrowUpRightSquareFill } from "react-icons/bs";

export default function Ricardian() {
  const value = useContext(AppContext);
  const { dao } = value.state;

  return(
    <>
    {dao['ricardian'] == null ? "None" :
    <UnorderedList>
      <ListItem>Name: Ricardian LLC, {dao["ricardian"]["series"]} Series</ListItem>
      <ListItem>
        <Text>Common URI: </Text>
        <Link
          passHref
          href={dao["ricardian"]["commonURI"]}
        >
          <Icon as={BsFillArrowUpRightSquareFill} />
        </Link>
      </ListItem>
      <ListItem>
        <Text>Master Operating Agreement: </Text>
        <Link
          passHref
          href={dao["ricardian"]["masterOperatingAgreement"]}
        >
          <Icon as={BsFillArrowUpRightSquareFill} />
        </Link>
      </ListItem>
    </UnorderedList>
    }
    </>
  );
}
