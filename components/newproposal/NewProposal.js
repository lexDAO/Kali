import { useState, useContext, useEffect } from 'react';
import AppContext from '../../context/AppContext';
import {
  Select,
  Text,
  Box,
  Grid,
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
        <Box backgroundColor="lightgrey" p={5} m={5}>
          {props.children}
          <Button onClick={() => setMenuItem(props.id)}>{props.text}</Button>
        </Box>
      )
    }

    const updateMenuItem = (e) => {
    let newValue = e.target.value;
    setMenuItem(newValue);
  };

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
                  <option value={index}>{p[0]}</option>
                ))
              }
            </Select>
          </FlexOutline>
        </form>
      </MobileView>

      <BrowserView>
      <Grid templateColumns={{sm: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)'}}>

        {
          proposalHelper.map((p, index) => (
            <ProposalTile id={index} text={p[0]} />
          ))
        }

      </Grid>
      </BrowserView>

      {proposalHelper.map((row, index) => (
        menuItem==index ? row[2] : null
      ))}

    </>
  )
}
