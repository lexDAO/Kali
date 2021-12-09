import { useState, useContext, useEffect } from 'react';
import { routeAfterSubmission } from '../../utils/router';
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
import FieldsAddMember from './FieldsAddMember';
import FieldsKickMember from './FieldsKickMember';
import FieldsContractIntegration from './FieldsContractIntegration';

export default function NewProposal() {
  const [proposalType, setProposalType] = useState(999); // arbitrary number where no proposal type is selected. if changed, must change below, too

  const value = useContext(AppContext);
  const { web3, loading, account, abi, address } = value.state;

  const submitProposal = async (event) => {
    event.preventDefault();
    value.setLoading(true);

    if(account===null) {
      alert("Please connect to wallet");
    } else {
      let object = event.target;
      var array = [];
      for (let i = 0; i < object.length; i++) {
        array[object[i].name] = object[i].value;
      }

      var { proposalType, description, account, amount, payload } = array;

      const instance = new web3.eth.Contract(abi, address);

      if (account.includes(".eth")) {
        account = await web3.eth.ens.getAddress(account).catch(() => {
          alert("ENS not found");
          value.setLoading(false);
        });
      }

      if (proposalType == 1) {
        amount = await instance.methods.balanceOf(account).call();
      }

      // convert units to wei for mint proposals - this should be covered for burn per balanceOf
      if (proposalType == 0) {
        amount = web3.utils.toWei(amount);
      }

      try {

        let result = await instance.methods
          .propose(proposalType, description, [account], [amount], [payload])
          .send({ from: account });
          value.setReload(value.state.reload+1);
          routeAfterSubmission(address);
      } catch (e) {
        alert(e);
      }
    }

    value.setLoading(false);
  };

  const updateProposalType = (e) => {
    let proposalType = e.target.value;
    setProposalType(proposalType);
  };

  return(
    <>
      <form onSubmit={submitProposal}>
        <FlexOutline>
          <Select
            name="proposalType"
            onChange={updateProposalType}
            color="kali.800"
            bg="kali.900"
            opacity="0.9"
          >
            <option value="999">Select a proposal type</option>
            <option value="0">Mint</option>
            <option value="1">Burn</option>
            <option value="2">Call</option>
          </Select>

          {proposalType == 0 ? <FieldsAddMember /> : ""}
          {proposalType == 1 ? <FieldsKickMember /> : ""}
          {proposalType == 2 ? <FieldsContractIntegration /> : ""}
          {proposalType != 999 ? (
            <Button type="submit">Submit Proposal</Button>
          ) : (
            ""
          )}
        </FlexOutline>
      </form>
    </>
  )
}
