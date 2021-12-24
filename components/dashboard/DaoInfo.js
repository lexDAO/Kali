import { useState, useContext, useEffect } from "react";
import AppContext from "../../context/AppContext";
import { Text, HStack, Link, Icon, UnorderedList, ListItem } from "@chakra-ui/react";
import { BsFillArrowUpRightSquareFill } from "react-icons/bs";

export default function DaoInfo() {
  const value = useContext(AppContext);
  const { dao } = value.state;

  return(
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
  );
}
