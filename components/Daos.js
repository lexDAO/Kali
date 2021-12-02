/* eslint-disable @next/next/link-passhref */
import React, { Component } from "react";
import factory from "../eth/factory.js";
const abi = require("../abi/KaliDAO.json");
import web3 from "../eth/web3.js";
import Link from "next/link";
import { Flex, Heading, Text, Button } from "@chakra-ui/react";
import FlexOutline from "./FlexOutline";

class Daos extends Component {
  render() {
    const eventArray = this.props.eventArray;
    console.log(eventArray);

    return (
      <>
        <Text fontSize="lg" fontWeight="semibold">
          Deployed DAOs
        </Text>
        {eventArray.map((e, index) => (
          <Button key={index}>
            <Link href={`/daos/${e["kaliDAO"]}`}>
              <Text fontSize="sm" isTruncated>
                {e["name"]} - {e["kaliDAO"]}
              </Text>
            </Link>
          </Button>
        ))}
      </>
    );
  }
}

export default Daos;
