import React, { Component } from "react";
import {
  chakra,
  Input,
  Button,
  Text,
  Flex,
  Select,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  Badge
} from '@chakra-ui/react';
import web3 from '../eth/web3.js';

class Proposals extends Component {

  render() {

    const { dao, proposals } = this.props;
    console.log(proposals);

    return (
      <React.Fragment>

        <Flex alignItems="center" justifyContent="center">
          { proposals.length == 0 ?
            <Flex>
              <Text><i>Awaiting Proposals</i></Text>
            </Flex>
             :
          <Table variant="simple">
            {proposals.map((p, index) => (
              <Tr key={index}>
                <Td><b>{p['type']}</b></Td>
                <Td><b><i>description:</i></b> {p['description']}<br />
                  { p['proposalType'] == 0 ?
                    <Text><b><i>account</i></b>: {p['account'][0]}<br />
                    <b><i>proposed shares:</i></b> {web3.utils.fromWei(p['amount'][0])}</Text>
                    : p['proposalType'] == 1 ?
                    <Text><b><i>address:</i></b> {p['account'][0]}<br />
                    <b><i>shares to burn:</i></b> {p['amount'][0]}</Text>
                    : p['proposalType'] == 2 ?
                    <Text><b><i>contract to call:</i></b> {p['account'][0]}<br />
                    <b><i>proposed payload:</i></b> {p['payload'][0]}</Text>
                    : p['proposalType'] == 3 ?
                    <Text><b><i>amount:</i></b> {p['amount'][0]}</Text>
                    : ''
                  }
                </Td>
                <Td><Badge colorScheme="green">yes: {web3.utils.fromWei(p['yesVotes'])}</Badge></Td>
                <Td><Badge colorScheme="red">no: {web3.utils.fromWei(p['noVotes'])}</Badge></Td>
                <Td>
                  {p['open'] ?
                  <form onSubmit={this.props.vote}>
                    <Input type="hidden" name="dao" value={this.props.dao['address']} />
                    <Input type="hidden" name="index" value={index} />
                    <Select name="approval">
                      <option value={1}>👍</option>
                      <option value={0}>👎</option>
                    </Select>
                    <Button colorScheme="teal" size="sm" variant="outline" type="submit">Vote</Button>

                  </form>
                :
                  <form onSubmit={this.props.process}>
                    <Input type="hidden" name="dao" value={this.props.dao['address']} />
                    <Input type="hidden" name="index" value={index} />
                    <Button colorScheme="teal" size="sm" variant="outline" type="submit">Process</Button>
                  </form>
                }
                </Td>
              </Tr>
            ))}
          </Table>
          }
        </Flex>

      </React.Fragment>
    );
  }
}

export default Proposals;
