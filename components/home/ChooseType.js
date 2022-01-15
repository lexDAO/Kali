import React, { useState, useContext } from "react";
import AppContext from "../../context/AppContext";
import { Flex, VStack, HStack, Button, Text, LinkBox, LinkOverlay, Grid, Icon, Spacer, Divider, Heading, UnorderedList, ListItem } from "@chakra-ui/react";
import { supportedChains } from "../../constants/supportedChains";
import { getNetworkName, convertVotingPeriod } from "../../utils/formatters";
import { presets } from "../../constants/presets";
import { HiUserGroup } from "react-icons/hi";

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

    props.handleNext();
  }

  const custom = () => {

  }

  const DashedDivider = () => {
    return (
      <Divider
        orientation="horizontal"
        variant="dashed"
        borderColor="white"
        mt={1}
        mb={5}
      />
    )
  }

  const DaoBox = (item) => {
    console.log(item.icon)
    return(
      <LinkBox
        className="dao-type"
        key={item.id}
      >
        <LinkOverlay href="#" onClick={() => handleClick(item.id)}>

          <HStack mb={5}>
            <Icon as={item.type['icon']} color='white.500' boxSize={10} />
            <Heading>{item.type['type']}</Heading>
          </HStack>

          <HStack>
            <Text>Voting Period</Text><Spacer /><Text>{convertVotingPeriod(item.type['voting'])}</Text>
          </HStack>
          <DashedDivider />
          <HStack>
            <Text>Quorum</Text><Spacer /><Text>{item.type['quorum']}%</Text>
          </HStack>
          <DashedDivider />
          <HStack>
            <Text>Supermajority</Text><Spacer /><Text>{item.type['supermajority']}%</Text>
          </HStack>
          <DashedDivider />
          <HStack>
            <Text>Shares</Text><Spacer /><Text>{item.type['paused'] == 0 ? "Transferrable" : "Nontransferrable"}</Text>
          </HStack>
          <Spacer p={5} />
          <Text>Extras:
            <UnorderedList>
            {Object.entries(item.type['extensions']).map(([key, value]) => (
              <ListItem><Text key={key}>{value['description']}</Text></ListItem>
            ))}
            </UnorderedList>
          </Text>

        </LinkOverlay>
      </LinkBox>
    )
  }

  return (
    <VStack id="chooseDaoType">
        <Heading as="h1"><b>Select governance type:</b></Heading>
        <Grid
          templateColumns={{
            sm: "repeat(1, 1fr)",
            md: "repeat(3, 1fr)",
            lg: "repeat(3, 1fr)",
          }}
          gap={15}
        >
        {presets.map((item, index) => (
          <DaoBox key={index} id={index} type={item} />
        ))}
        </Grid>
    </VStack>
  );
}
