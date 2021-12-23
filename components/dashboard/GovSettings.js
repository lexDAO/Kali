import { useState, useContext, useEffect } from "react";
import AppContext from "../../context/AppContext";
import { Text } from "@chakra-ui/react";
import { convertVotingPeriod } from "../../utils/formatters";

export default function GovSettings() {
  const value = useContext(AppContext);
  const { dao } = value.state;

  return(
    <>
    <Text>Paused: {dao["token"]["paused"].toString()}</Text>
    <Text>
      Voting period: {convertVotingPeriod(dao["gov"]["votingPeriod"])}
    </Text>
    <Text>Quorum: {dao["gov"]["quorum"]}%</Text>
    <Text>Supermajority: {dao["gov"]["supermajority"]}%</Text>
    </>
  );
}
