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
import SendShares from "./SendShares";
import RemoveMember from "./RemoveMember";
import SendToken from "./SendToken";
import ContractCall from "./ContractCall";
import {BrowserView, MobileView} from 'react-device-detect';

export default function NewProposal(props) {
  const [menuItem, setMenuItem] = useState(0); // arbitrary number where no proposal type is selected. if changed, must change below, too
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

  const proposalTypes = ["Send Shares", "Send a Token", "Call a Contract", "Remove Member"];

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
                proposalTypes.map((p, index) => (
                  <option value={index}>{p}</option>
                ))
              }
            </Select>
          </FlexOutline>
        </form>
      </MobileView>

      <BrowserView>
      <Grid templateColumns={{sm: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)'}}>

        {
          proposalTypes.map((p, index) => (
            <ProposalTile id={index} text={p} />
          ))
        }

      </Grid>
      </BrowserView>
      {menuItem==0 ? <SendShares /> : null }
      {menuItem==1 ? <SendToken /> : null }
      {menuItem==2 ? <ContractCall /> : null }
      {menuItem==3 ? <RemoveMember /> : null }

    </>
  )
}
