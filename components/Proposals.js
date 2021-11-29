import React, { Component } from "react";
import Router, { useRouter } from "next/router";
import web3 from "../eth/web3.js";
const abi = require("../abi/KaliDAO.json");
import {
  chakra,
  Input,
  Button,
  Text,
  Flex,
  Box,
  Select,
  Badge,
  Grid,
  Icon,
  IconButton,
  Stack,
  HStack,
  VStack,
  Spacer,
} from "@chakra-ui/react";
import FlexOutline from "./FlexOutline";

import {
  BsHandThumbsUpFill,
  BsHandThumbsDownFill,
  BsFillPersonPlusFill,
  BsFillPersonXFill,
  BsFillMegaphoneFill,
} from "react-icons/bs";

class Proposals extends Component {
  vote = async () => {
    event.preventDefault();

    this.props.toggleLoading();

    let object = event.target;
    var array = [];
    for (let i = 0; i < object.length; i++) {
      array[object[i].name] = object[i].value;
    }

    const { dao, id, approval } = array;

    const instance = new web3.eth.Contract(abi, dao);

    const accounts = await web3.eth.getAccounts();
    // * first, see if they already voted * //
    const voted = await instance.methods.voted(id, accounts[0]).call();
    if (voted == true) {
      alert("You already voted");
      this.props.toggleLoading();
    } else {
      try {
        let result = await instance.methods
          .vote(id, parseInt(approval))
          .send({ from: accounts[0] });

        Router.push({
          pathname: "/daos/[dao]",
          query: { dao: dao },
        });
      } catch (e) {}

      this.props.toggleLoading();
    }
  };

  process = async () => {
    event.preventDefault();
    this.props.toggleLoading();
    let object = event.target;
    var array = [];
    for (let i = 0; i < object.length; i++) {
      array[object[i].name] = object[i].value;
    }

    const { dao, id } = array;

    const instance = new web3.eth.Contract(abi, dao);

    try {
      const accounts = await web3.eth.getAccounts();
      // * first, see if they already voted * //
      let result = await instance.methods
        .processProposal(id)
        .send({ from: accounts[0] });

      Router.push({
        pathname: "/daos/[dao]",
        query: { dao: dao },
      });
    } catch (e) {
      alert(e);
    }

    this.props.toggleLoading();
  };

  render() {
    const { dao, proposals, chainInfo } = this.props;
    console.log(proposals);
    console.log(chainInfo);

    return (
      <>
        {proposals.length == 0 ? (
          <>
            <Flex>
              <Text>
                <i>Awaiting Proposals</i>
              </Text>
            </Flex>
          </>
        ) : (
          <Grid templateColumns="repeat(1, 1fr)" gap={1}>
            {proposals.map((p, index) => (
              <FlexOutline key={proposals}>
                <Stack spacing={3}>
                  <HStack>
                    <VStack
                      alignItems="left"
                      //backgroundColor="kali.800"
                      spacing={1}
                    >
                      <Text fontSize="md">
                        <b>{p["description"]}</b>
                      </Text>
                      {p["proposalType"] == 0 ? (
                        <>
                          <HStack>
                            <Icon as={BsFillPersonPlusFill} />
                            <Text>Mint Shares</Text>
                          </HStack>
                          <Text fontSize="sm">Account: {p["account"]}</Text>
                          <Text fontSize="sm">Shares: {p["amount"]}</Text>
                        </>
                      ) : (
                        ""
                      )}
                      {p["proposalType"] == 1 ? (
                        <>
                          <HStack>
                            <Icon as={BsFillPersonXFill} />
                            <Text>Burn Shares</Text>
                          </HStack>
                          <Text fontSize="sm">Account: {p["account"]}</Text>
                          <Text fontSize="sm">Shares: {p["amount"]}</Text>
                        </>
                      ) : (
                        ""
                      )}
                      {p["proposalType"] == 2 ? (
                        <>
                          <HStack>
                            <Icon as={BsFillMegaphoneFill} />
                            <Text>Call Contract</Text>
                          </HStack>
                          <Text fontSize="sm">Contract: {p["account"]}</Text>
                          <Text fontSize="sm">Payload: {p["payload"]}</Text>
                        </>
                      ) : (
                        ""
                      )}
                      <Text fontSize="sm">
                        <i>
                          created: {p["created"]} <br />
                          by: {p["proposer"]}
                        </i>
                      </Text>
                    </VStack>

                    <Spacer />

                    <VStack>
                      <Badge colorScheme="green">
                        yes: {web3.utils.fromWei(p["yesVotes"])}
                      </Badge>
                      <Badge colorScheme="red">
                        no: {web3.utils.fromWei(p["noVotes"])}
                      </Badge>

                      <Spacer />

                      <HStack>
                        {p["open"] ? (
                          <>
                            <form onSubmit={this.vote}>
                              <Input
                                type="hidden"
                                name="dao"
                                value={this.props.dao["address"]}
                              />
                              <Input type="hidden" name="id" value={p["id"]} />
                              <Input type="hidden" name="approval" value={1} />
                              <IconButton
                                icon={<BsHandThumbsUpFill />}
                                type="submit"
                              />
                            </form>

                            <form onSubmit={this.vote}>
                              <Input
                                type="hidden"
                                name="dao"
                                value={this.props.dao["address"]}
                              />
                              <Input type="hidden" name="id" value={p["id"]} />
                              <Input type="hidden" name="approval" value={0} />
                              <IconButton
                                icon={<BsHandThumbsDownFill />}
                                type="submit"
                              />
                            </form>
                          </>
                        ) : (
                          <>
                            <form onSubmit={this.process}>
                              <Input
                                type="hidden"
                                name="dao"
                                value={this.props.dao["address"]}
                              />
                              <Input type="hidden" name="id" value={p["id"]} />
                              <Button type="submit">Process</Button>
                            </form>
                          </>
                        )}
                      </HStack>
                    </VStack>
                  </HStack>
                </Stack>
              </FlexOutline>
            ))}
          </Grid>
        )}
      </>
    );
  }
}

export default Proposals;
