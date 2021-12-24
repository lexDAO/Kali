import { useState, useContext, useEffect } from "react";
import AppContext from "../../context/AppContext";
import { Text, HStack, Link, Icon } from "@chakra-ui/react";
import { BsFillArrowUpRightSquareFill } from "react-icons/bs";

export default function DaoInfo() {
  const value = useContext(AppContext);
  const { dao } = value.state;

  return(
    <>
    <Text>Name: {dao["name"]}</Text>
    <HStack>
      <Text>Address: {dao["address"]}</Text>
      <Link
        passHref
        href={`https://rinkeby.etherscan.io/address/${dao["address"]}`}
      >
        <Icon as={BsFillArrowUpRightSquareFill} />
      </Link>
    </HStack>
    <Text>Symbol: {dao["token"]["symbol"]}</Text>
    <Text>
      Shares: {dao["token"]["totalSupply"] / 1000000000000000000}{" "}
    </Text>

    <HStack>
      <Text>Docs: {dao["docs"]}</Text>
      <Link href={`${dao["docs"]}`}>
        <Icon as={BsFillArrowUpRightSquareFill} />
      </Link>
    </HStack>

    <Text>Members: {dao["members"].length}</Text>
    </>
  );
}
