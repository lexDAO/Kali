import { useState, useContext, useEffect } from "react";
import Router, { useRouter } from "next/router";
import AppContext from "../../context/AppContext";
import { Input, Button, Select, Text, Textarea, Stack } from "@chakra-ui/react";

export default function ContractCall() {
  const value = useContext(AppContext);
  const { web3, loading, account, abi, address } = value.state;

  const [abi_, setAbi_] = useState(null);
  const [functions, setFunctions] = useState(null);
  const [functionName, setFunctionName] = useState(null);
  const [inputs, setInputs] = useState(null);
  const [inputParams, setInputParams] = useState(null);

  const updateABI = (event) => {
    setAbi_(event.target.value);
  };

  const parseABI = (e) => {
    try {
      let array = JSON.parse(abi_);
      const functions_ = [];
      for (var i = 0; i < array.length; i++) {
        let item = array[i];
        if (item["type"] == "function") {
          functions_.push(item);
        }
      }
      setFunctions(functions_);
      setInputs(null);
    } catch (e) {
      value.toast(e);
    }
  };

  const onFunctionSelect = (e) => {
    if (e.target.value == 999) {
      setInputs(null);
      setFunctionName(null);
    } else {
      let id = e.target.value;
      let inputs_ = functions[id]["inputs"];
      let name_ = functions[id]["name"];
      setInputs(inputs_);
      setFunctionName(name_);
    }
  };

  const onInputChange = (e) => {
    let element = document.getElementById("inputFields");
    let children = element.children;
    let array = [];
    for (var i = 0; i < children.length; i++) {
      let item = children[i].value;
      if (item != undefined) {
        array.push(children[i].value);
      }
    }
    console.log(array);
    setInputParams(JSON.stringify(array));
  };

  const submitProposal = async (event) => {
    event.preventDefault();
    value.setLoading(true);

    try {
      let object = event.target;
      var array = [];
      for (let i = 0; i < object.length; i++) {
        array[object[i].name] = object[i].value;
      }

      var {
        proposalType_,
        description_,
        account_,
        amount_,
        abi_,
        functionName,
        inputParams,
        inputs,
      } = array; // this must contain any inputs from custom forms

      console.log(array);

      abi_ = JSON.parse(abi_);

      inputs = JSON.parse(inputs);
      inputParams = JSON.parse(inputParams);
      console.log("test");
      console.log(abi_);
      console.log(inputs);
      console.log(inputParams);

      var payload_ = web3.eth.abi.encodeFunctionCall(
        {
          name: functionName,
          type: "function",
          inputs: inputs,
        },
        inputParams
      );
      console.log(payload_);
      const instance = new web3.eth.Contract(abi, address);

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
        value.setVisibleView(1);
      } catch (e) {
        value.toast(e);
        value.setLoading(false);
      }
    } catch (e) {
      value.toast(e);
      value.setLoading(false);
    }

    value.setLoading(false);
  };

  return (
    <form onSubmit={submitProposal}>
      <Stack>
        <Text>
          <b>Details</b>
        </Text>
        <Textarea name="description_" size="lg" placeholder=". . ." />

        <Text>
          <b>Target</b>
        </Text>
        <Input name="account_" size="lg" placeholder="0x"></Input>

        <Input name="amount_" type="hidden" value={0} />

        <Text>
          <b>ABI</b>
        </Text>
        <Textarea size="lg" placeholder=". . ." onChange={updateABI} />
        <Input type="hidden" name="abi_" value={abi_} />
        <Input type="hidden" name="inputs" value={JSON.stringify(inputs)} />

        <Button onClick={parseABI}>Parse ABI</Button>
        {functions == null ? null : (
          <>
            <Select onChange={onFunctionSelect}>
              <option value="999">Select a function</option>
              {functions.map((f, index) => (
                <option key={index} value={index}>
                  {f["name"]}
                </option>
              ))}
            </Select>
            <Input type="hidden" name="functionName" value={functionName} />
          </>
        )}
        {inputs == null ? null : (
          <>
            <Input type="hidden" name="inputParams" value={inputParams} />
            <div id="inputFields">
              {inputs.map((input, index) => (
                <>
                  <Text>{input["name"]}</Text>
                  <Input onChange={onInputChange} />
                </>
              ))}
            </div>
          </>
        )}
        <Input type="hidden" name="proposalType_" value="2" />

        <Button type="submit">Submit Proposal</Button>
      </Stack>
    </form>
  );
}
