import { useState, useContext, useEffect } from 'react';
import AppContext from '../../context/AppContext';
import {
  Input,
  Button,
  Select,
  Text,
  Textarea,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";
import FlexOutline from "../elements/FlexOutline";
import ProposalType0 from './ProposalType0';
import ProposalType1 from './ProposalType1';
import ProposalType2 from './ProposalType2';
import ProposalType3 from './ProposalType3';
import { getBalances } from '../../utils/getterFunctions';
import { proposalTypeMappings } from '../../utils/appParams';

export default function NewProposal(props) {
  const [menuItem, setMenuItem] = useState(999); // arbitrary number where no proposal type is selected. if changed, must change below, too

  const value = useContext(AppContext);
  const { web3, loading, account, abi, address } = value.state;
  const balances = props.balances;

  const submitProposal = async (event) => {
    event.preventDefault();
    value.setLoading(true);

    if(account===null) {
      alert("Please connect to wallet");
    } else {
      try {
        let object = event.target;
        var array = [];
        for (let i = 0; i < object.length; i++) {
          array[object[i].name] = object[i].value;
        }

        var {
          menuItem,
          proposalType,
          description,
          account_,
          amount,
          payload,
          recipient,
          tokenAmount,
          functionName,
          inputParams,
          abi_,
          inputs
        } = array; // this must contain any inputs from custom forms

        console.log(array);

        const instance = new web3.eth.Contract(abi, address);

        if (account_.includes(".eth")) {
          account_ = await web3.eth.ens.getAddress(account_).catch(() => {
            alert("ENS not found");
            value.setLoading(false);
          });
        }

        if (proposalType == 1) {
          amount = web3.utils.toWei(amount);
        }

        if (proposalType == 1) {
          amount = await instance.methods.balanceOf(account_).call();
        }

        if (menuItem == 3) { //these are hard coded! remember if we have to change code
          amount = 0;
          tokenAmount = web3.utils.toWei(tokenAmount);
          console.log(tokenAmount);
          const ierc20 = require('../../abi/ERC20.json');
          const tokenContract = new web3.eth.Contract(ierc20, account_);
          payload = tokenContract.methods.transfer(recipient, tokenAmount).encodeABI();
        }
        console.log(payload)

        if(menuItem == 2) {
          abi_ = JSON.parse(abi_);

          inputs = JSON.parse(inputs);
          inputParams = JSON.parse(inputParams);
          console.log(Array.isArray(inputParams));
          console.log(abi_);
          console.log(inputs);
          console.log(inputParams);

          payload = web3.eth.abi.encodeFunctionCall({
            name: functionName,
            type: 'function',
            inputs: inputs
            }, inputParams
          );

        }
        try {

          let result = await instance.methods
            .propose(proposalType, description, [account_], [amount], [payload])
            .send({ from: account });
            value.setReload(value.state.reload+1);
            props.setVisible(1);
        } catch (e) {
          alert(e);
          value.setLoading(false);
        }
      } catch(e) {
        alert(e);
        value.setLoading(false);
      }
    }

    value.setLoading(false);
  };

  const updateMenuItem = (e) => {
    let newValue = e.target.value;
    setMenuItem(newValue);
  };

  return(
    <>
      <form onSubmit={submitProposal}>
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
            <option value="1">Remove Member</option>
            <option value="2">Call Contract</option>
            <option value="3">Send a Token</option>
          </Select>

          {menuItem == 0 ? <ProposalType0 /> : ""}
          {menuItem == 1 ? <ProposalType1 /> : ""}
          {menuItem == 2 ? <ProposalType2 /> : ""}
          {menuItem == 3 ? <ProposalType3 balances={balances} /> : ""}
          {menuItem != 999 ? (
            <Button type="submit">Submit Proposal</Button>
          ) : (
            ""
          )}
        </FlexOutline>
        <input type="hidden" name="proposalType" value={proposalTypeMappings[menuItem]} />
      </form>
    </>
  )
}
