import { useState, useContext, useEffect } from "react";
import AppContext from "../../context/AppContext";
import { Text, UnorderedList, ListItem } from "@chakra-ui/react";
import { fromDecimals } from "../../utils/formatters";

export default function Treasury() {
  const value = useContext(AppContext);
  const { dao } = value.state;

  return(
    <>
    <Text>Name: {dao["name"]}</Text>
    <Text>Balances:</Text>
    <UnorderedList>
      {dao["balances"].map((b, index) => (
        <ListItem key={index}>
          {b["token"]} ({fromDecimals(b["balance"], 18)})
        </ListItem>
      ))}
    </UnorderedList>
    </>
  );
}
