import { useState, useContext, useEffect } from "react";
import AppContext from "../../context/AppContext";
import { Text, UnorderedList, ListItem } from "@chakra-ui/react";
import { convertVotingPeriod } from "../../utils/formatters";

export default function GovSettings() {
  const value = useContext(AppContext);
  const { dao } = value.state;

  return(
    <UnorderedList>
    <ListItem>Paused: {dao["token"]["paused"].toString()}</ListItem>
    <ListItem>
      Voting period: {convertVotingPeriod(dao["gov"]["votingPeriod"])}
    </ListItem>
    <ListItem>Quorum: {dao["gov"]["quorum"]}%</ListItem>
    <ListItem>Supermajority: {dao["gov"]["supermajority"]}%</ListItem>
    </UnorderedList>
  );
}
