import { useState, useContext, useEffect } from "react";
import AppContext from "../../context/AppContext";
import { Text, UnorderedList, ListItem } from "@chakra-ui/react";
import { fromDecimals } from "../../utils/formatters";
export default function Members() {
  const value = useContext(AppContext);
  const { dao } = value.state;

  return(
    <>
    <UnorderedList>
      {dao["members"].map((m, index) => (
        <ListItem key={index}>{m['member']} ({fromDecimals(m['shares'], 18)} shares)</ListItem>
      ))}
    </UnorderedList>
    </>
  );
}
