import { useState, useContext, useEffect } from "react";
import AppContext from "../../context/AppContext";
import { Text, HStack, Link, Icon, Spacer } from "@chakra-ui/react";
import { BsFillArrowUpRightSquareFill } from "react-icons/bs";
import DashedDivider from "../elements/DashedDivider";

export default function Ricardian() {
  const value = useContext(AppContext);
  const { dao } = value.state;

  const array = [
    {
      name: "Name",
      info: "Ricardian LLC, " + dao["ricardian"]["series"] + " Series",
      link: null
    },
    {
      name: "Common URI",
      info: null,
      link: dao["ricardian"]["commonURI"]
    },
    {
      name: "Master Operating Agreement",
      info: null,
      link: dao["ricardian"]["masterOperatingAgreement"]
    },
  ]

  return(
    <>
    {array.map((item, index) => (
      <>
        <>
      <HStack>
        <Text>{item.name}</Text>
        <Spacer />
        {item.info != null ?
        <Text>{item.info}</Text>
        : null}
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
      </>
    ))}
    </>
  );
}
