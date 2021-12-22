import { useState, useContext, useEffect } from "react";
import Router, { useRouter } from "next/router";
import AppContext from "../../context/AppContext";
import { Input, Button, Text, Textarea, Stack, Select } from "@chakra-ui/react";
import { addresses } from "../../constants/addresses";
import { extensionsHelper } from "../../constants/extensionsHelper";
import NumInputField from "../elements/NumInputField";

export default function Extensions() {
  const value = useContext(AppContext);
  const { web3, loading, account, abi, address, chainId, balances } =
    value.state;
  const [propType, setPropType] = useState("tribute");
  const [ext, setExt] = useState();

  const handleChange = (e) => {
    let propType_ = e.target.value;
    setPropType(propType_);
    let ext_ = addresses[chainId]["extensions"][propType_];
    setExt(ext_);
    console.log(ext_);
  };

  const submitProposal = async (event) => {
    event.preventDefault();
    value.setLoading(true);

    if (account === null) {
      alert("connect");
    } else {
      try {
        let object = event.target;
        var array = [];
        for (let i = 0; i < object.length; i++) {
          array[object[i].name] = object[i].value;
        }

        var { description_, account_, proposalType_ } = array; // this must contain any inputs from custom forms

        const payload_ = Array(0);

        const instance = new web3.eth.Contract(abi, address);

        const amount_ = 0;

        try {
          let result = await instance.methods
            .propose(
              proposalType_,
              description_,
              [account_],
              [amount_],
              [payload_]
            )
            .send({ from: account });
          value.setReload(value.state.reload + 1);
          value.setVisibleView(1);
        } catch (e) {
          alert("send-transaction");
          value.setLoading(false);
        }
      } catch (e) {
        alert("send-transaction");
        value.setLoading(false);
      }
    }

    value.setLoading(false);
  };

  return (
    <Stack>
      <Text>
        <b>Extension</b>
      </Text>
      <Select onChange={handleChange}>
        {Object.entries(extensionsHelper).map(([key, value]) => (
          <option key={key} value={key}>
            {key}
          </option>
        ))}
      </Select>

      {Object.entries(extensionsHelper).map(([key, value]) =>
        propType == key ? value : null
      )}
    </Stack>
  );
}
