import { useState, useContext, useEffect } from 'react';
import AppContext from '../../context/AppContext';
import {
  Input,
  Button,
  Select,
  Text,
  Textarea
} from "@chakra-ui/react";
import FlexOutline from "../elements/FlexOutline";
import SendShares from "./SendShares";
import RemoveMember from "./RemoveMember";
import SendToken from "./SendToken";
import ContractCall from "./ContractCall";

export default function NewProposal(props) {
  const [menuItem, setMenuItem] = useState(999); // arbitrary number where no proposal type is selected. if changed, must change below, too

  const value = useContext(AppContext);
  const { web3, loading, account, abi, address } = value.state;
  const balances = props.balances;

  const updateMenuItem = (e) => {
    let newValue = e.target.value;
    setMenuItem(newValue);
  };

  const test = 0;

  return(
    <>
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
            <option value="0">Send Shares</option>
            <option value="1">Send a Token</option>
            <option value="2">Call Contract</option>
            <option value="3">Remove Member</option>

          </Select>

        </FlexOutline>

      </form>

      {menuItem==0 ? <SendShares /> : null }
      {menuItem==1 ? <SendToken /> : null }
      {menuItem==2 ? <ContractCall /> : null }
      {menuItem==3 ? <RemoveMember /> : null }

    </>
  )
}
