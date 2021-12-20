import { useContext, useState } from 'react';
import AppContext from '../../context/AppContext';
import {
  Input,
  Button
} from "@chakra-ui/react";
import { alertMessage } from "../../utils/helpers";

export default function ProcessModule(props) {
  const value = useContext(AppContext);
  const { web3, loading, account, abi, address } = value.state;
  const p = props['p'];
  const i = props['i'];
  var disabled = true;
  if(i==0) {disabled = false;}

  const process = async (event) => {
    event.preventDefault();
    value.setLoading(true);

    if(account===null) {
      alertMessage('connect');
    } else {
      let object = event.target;
      var array = [];
      for (let i = 0; i < object.length; i++) {
        array[object[i].name] = object[i].value;
      }

      const { dao, id } = array;

      try {

        const instance = new web3.eth.Contract(abi, address);

        let result = await instance.methods
          .processProposal(id)
          .send({ from: account });

          value.setReload(value.state.reload+1);

      } catch (e) {
        alertMessage('send-transaction');
        value.setLoading(false);
      }
    }

    value.setLoading(false);
  };

  return(
    <form onSubmit={process}>
      <Input
        type="hidden"
        name="dao"
      />
      <Input type="hidden" name="id" value={p["id"]} />
      {i == 0 || p['proposalType'] == 9 ?
      <Button type="submit">Process</Button>
      :
      <Button type="submit" disabled>In Queue</Button>
      }
    </form>
  )
}
