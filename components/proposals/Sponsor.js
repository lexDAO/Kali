import { useContext, useState } from "react";
import AppContext from "../../context/AppContext";
import { Input, Button } from "@chakra-ui/react";

export default function Sponsor(props) {
  const value = useContext(AppContext);
  const { web3, loading, account, abi, address } = value.state;
  const p = props["p"];
  const i = props["i"];
  var disabled = true;
  if (i == 0) {
    disabled = false;
  }

  const sponsor = async (event) => {
    event.preventDefault();
    value.setLoading(true);

    if (account === null) {
      alert("connect");
    } else {
      let object = event.target;
      var array = [];
      for (let i = 0; i < object.length; i++) {
        array[object[i].name] = object[i].value;
      }

      const { id } = array;

      try {
        const instance = new web3.eth.Contract(abi, address);

        let result = await instance.methods
          .sponsorProposal(id)
          .send({ from: account });
      } catch (e) {
        alert(e);
        value.setLoading(false);
      }
    }

    value.setLoading(false);
  };

  return (
    <form onSubmit={sponsor}>
      <Input type="hidden" name="id" value={p["id"]} />

      <Button type="submit">Sponsor</Button>
    </form>
  );
}
