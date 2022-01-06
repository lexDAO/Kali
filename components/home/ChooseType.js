import React, { useState, useContext } from "react";
import AppContext from "../../context/AppContext";
import { Flex, VStack, Button, Text, LinkBox, LinkOverlay, Grid } from "@chakra-ui/react";
import { supportedChains } from "../../constants/supportedChains";
import { getNetworkName, convertVotingPeriod } from "../../utils/formatters";
import { presets } from "../../constants/presets";

export default function ChooseType(props) {
  const value = useContext(AppContext);
  const { web3, chainId, loading, account } = value.state;
  const daoType = props.details['daoType'];

  const handleClick = (id) => {
    let array = props.details;
    array['daoType'] = id;
    array['quorum'] = presets[id]['quorum'];
    array['supermajority'] = presets[id]['supermajority'];
    array['votingPeriod'] = presets[id]['voting'];
    array['paused'] = presets[id]['paused'];
    array['extensions'] = presets[id]['extensions'];
    props.setDetails(array);
    console.log(props.details)

    props.handleNext(4);
  }

  const custom = () => {
    props.handleNext(3);
  }

  const DaoBox = (item) => {
    return(
      <LinkBox
        key={item.id}
        border="1px solid"
        p={5}
        m={2}
        borderRadius="2xl"
        _hover={{
          bgGradient: "linear(to-br, kali.600, kali.700)",
        }}
      >
        <LinkOverlay href="#" onClick={() => handleClick(item.id)}>
          <Text fontSize="xl">{item.type['type']}</Text>
          <Text>Voting Period: {convertVotingPeriod(item.type['voting'])}</Text>
          <Text>Quorum: {item.type['quorum']}%</Text>
          <Text>Supermajority: {item.type['supermajority']}%</Text>
          <Text>{item.type['paused'] == 0 ? "Shares transferrable" : "Shares nontransferrable"}</Text>
          <Text>Extras:
            {Object.entries(item.type['extensions']).map(([key, value]) => (
              <Text key={key}>{value['description']}</Text>
            ))}
          </Text>
        </LinkOverlay>
      </LinkBox>
    )
  }

  return (
    <VStack>
        <Text fontSize="xl"><b>Select DAO type</b></Text>
        <Grid
          templateColumns={{
            sm: "repeat(1, 1fr)",
            md: "repeat(2, 1fr)",
            lg: "repeat(2, 1fr)",
          }}
        >
        {presets.map((item, index) => (
          <DaoBox key={index} id={index} type={item} />
        ))}
        <LinkBox
          border="1px solid"
          p={5}
          m={2}
          borderRadius="2xl"
          _hover={{
            bgGradient: "linear(to-br, kali.600, kali.700)",
          }}
        >
          <LinkOverlay href="#" onClick={custom}>
            <Text fontSize="xl"><b>Custom</b></Text>
          </LinkOverlay>
        </LinkBox>
        </Grid>
    </VStack>
  );
}
