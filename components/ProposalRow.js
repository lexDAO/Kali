import { useContext } from 'react';
import AppContext from '../context/AppContext';
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
import {
  BsHandThumbsUpFill,
  BsHandThumbsDownFill,
  BsFillPersonPlusFill,
  BsFillPersonXFill,
  BsFillMegaphoneFill,
} from "react-icons/bs";
import FlexOutline from './FlexOutline';

export default function ProposalRow(props) {
  const value = useContext(AppContext);
  const { web3, loading } = value.state;
  const p = props['p'];

  return(
    <FlexOutline>
      <Stack spacing={3}>
        <HStack>
          <VStack
            alignItems="left"
            //backgroundColor="kali.800"
            spacing={1}
            maxW="500px"
            //width={{sm: '300px', md: '500px', lg: '600px'}}
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
                <Text fontSize="sm" maxW="xl">Payload: {p["payload"]}</Text>
              </>
            ) : (
              ""
            )}
            <Text fontSize="sm">
              <i>
                created: {p["created"]} <br />
                expires: {p["expires"]}<br />
                {p["timer"]>0 ? <>timer: {p["timer"]}</> : ''}
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
                  <form onSubmit={props.vote}>
                    <Input
                      type="hidden"
                      name="dao"
                      value={props['address']}
                    />
                    <Input type="hidden" name="id" value={p["id"]} />
                    <Input type="hidden" name="approval" value={1} />
                    <IconButton
                      icon={<BsHandThumbsUpFill />}
                      type="submit"
                    />
                  </form>

                  <form onSubmit={props.vote}>
                    <Input
                      type="hidden"
                      name="dao"
                      value={props['address']}
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
                  <form onSubmit={props.process}>
                    <Input
                      type="hidden"
                      name="dao"
                      value={props['address']}
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
  )
}
