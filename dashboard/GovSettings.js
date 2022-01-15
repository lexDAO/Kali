import { useState, useContext, useEffect } from "react";
import AppContext from "../../context/AppContext";
import { Text, UnorderedList, ListItem, HStack, Spacer, Link, Icon } from "@chakra-ui/react";
import { convertVotingPeriod } from "../../utils/formatters";
import DashedDivider from "../elements/DashedDivider";

export default function GovSettings() {
  const value = useContext(AppContext);
  const { dao } = value.state;
  const array = [
    {
      name: "Paused",
      info: dao["token"]["paused"].toString(),
    },
    {
      name: "Voting Period",
      info: convertVotingPeriod(dao["gov"]["votingPeriod"])
    },
    {
      name: "Quorum",
      info: dao["gov"]["quorum"] + "%"
    },
    {
      name: "Supermajority",
      info: dao["gov"]["supermajority"] + "%"
    }
  ]

  return(
    <>
    {array.map((item, index) => (
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
    ))}
    </>
  );
}
