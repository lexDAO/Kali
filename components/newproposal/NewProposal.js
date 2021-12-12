import { useState, useContext, useEffect } from 'react';
import AppContext from '../../context/AppContext';
import {
  Select,
  Text,
  Box,
  Grid,
  LinkBox,
  LinkOverlay,
  Heading,
  Button
} from "@chakra-ui/react";
import FlexOutline from "../elements/FlexOutline";
import { BrowserView, MobileView } from 'react-device-detect';
import { proposalHelper } from '../../utils/proposalHelper';

export default function NewProposal(props) {
  const [menuItem, setMenuItem] = useState(999); // arbitrary number where no proposal type is selected. if changed, must change below, too
  const value = useContext(AppContext);
  const { web3, loading, account, abi, address } = value.state;
  const balances = props.balances;

  const ProposalTile = (props) => {
    return(
        <LinkBox backgroundColor="lightgrey" p={5} m={5} rounded="lg">
          <LinkOverlay href="#" onClick={() => setMenuItem(props.id)}>
          <Heading size="md"><b>{props.title}</b></Heading>
          </LinkOverlay>
          <Text>{props.description}</Text>
        </LinkBox>
      )
    }

    const updateMenuItem = (e) => {
    let newValue = e.target.value;
    setMenuItem(newValue);
  };

  const BackButton = () => {
    return(
      <Button size="sm" onClick={() => setMenuItem(999)} marginBottom={5}>« Back</Button>
    )
  }

  return(
    <>
      <MobileView>
        <form>
          <FlexOutline>
            <Select
              name="menuItem" // will have to convert to proposalType corresponding with smart contract enums
              onChange={updateMenuItem}
              color="kali.800"
              bg="kali.900"
              opacity="0.9"
            >
              <option value="999">Select a proposal type</option>
              {
                proposalHelper.map((p, index) => (
                  <option key={index} value={index}>{p[0]}</option>
                ))
              }
            </Select>
          </FlexOutline>
        </form>
      </MobileView>
      {menuItem < 999 ? <BackButton /> :
      <BrowserView>
      <Grid templateColumns={{sm: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)'}}>

        {
          proposalHelper.map((p, index) => (
            <ProposalTile key={index} id={index} title={p[0]} description={p[1]} />
          ))
        }

      </Grid>
      </BrowserView>
      }
      {proposalHelper.map((row, index) => (
        menuItem==index ? row[2] : null
      ))}

    </>
  )
}
