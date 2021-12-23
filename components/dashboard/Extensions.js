import { useState, useContext, useEffect } from "react";
import AppContext from "../../context/AppContext";
import { Text, UnorderedList, ListItem } from "@chakra-ui/react";

export default function Extensions() {
  const value = useContext(AppContext);
  const { dao } = value.state;

  return(
    <>
    <Text>Extensions</Text>
    <UnorderedList>
      {dao["extensions"].map((e, index) => (
        <ListItem key={index}>{e}</ListItem>
      ))}
    </UnorderedList>
    </>
  );
}
