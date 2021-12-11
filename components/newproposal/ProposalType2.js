import { useState, useContext, useEffect } from 'react';
import Router, { useRouter } from "next/router";
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

export default function ProposalType2() {

  const [abi_, setAbi_] = useState(null);
  const [functions, setFunctions] = useState(null);
  const [functionName, setFunctionName] = useState(null);
  const [inputs, setInputs] = useState(null);
  const [inputParams, setInputParams] = useState(null);

  const updateABI = (event) => {
    setAbi_(event.target.value);
  }

  const parseABI = (e) => {
    try {
      let array = JSON.parse(abi_);
      const functions_ = [];
      for(var i=0; i < array.length; i++) {
        let item = array[i];
        if(item['type']=="function") {
          functions_.push(item);
        }
      }
      setFunctions(functions_);
      setInputs(null);
    } catch(error) {
      alert("Please enter valid JSON")
    }

  }

  const onFunctionSelect = (e) => {
    if(e.target.value==999) {
        setInputs(null);
        setFunctionName(null);
    } else {
      let id = e.target.value;
      let inputs_ = functions[id]['inputs'];
      let name_ = functions[id]['name'];
      setInputs(inputs_);
      setFunctionName(name_);
    }
  }

  const onInputChange = (e) => {
    let element = document.getElementById("inputFields");
    let children = element.children;
    let array = [];
    for(var i=0; i<children.length; i++) {
      let item = children[i].value;
      if(item!=undefined) {
        array.push(children[i].value);
      }
    }
    console.log(array)
    setInputParams(JSON.stringify(array));
  }

  return (
    <>
      <Text><b>Details</b></Text>
      <Textarea name="description" size="lg" placeholder=". . ." />
      <Text><b>Target</b></Text>
      <Input name="account_" size="lg" placeholder="0x"></Input>
      <Input name="amount" type="hidden" value={0} />
      <Text><b>ABI</b></Text>
      <Textarea size="lg" placeholder=". . ." onChange={updateABI} />
      <Input type="hidden" name="abi_" value={abi_} />
      <Input type="hidden" name="inputs" value={JSON.stringify(inputs)} />
      <Button onClick={parseABI}>Parse ABI</Button>
      {functions == null ? null :
        <>
        <Select name="parsedFunction" onChange={onFunctionSelect}>
            <option value="999">Select a function</option>
          {functions.map((f, index) =>(
            <option key={index} value={index}>{f['name']}</option>
          ))}
        </Select>
        <Input type="hidden" name="functionName" value={functionName} />
        </>
      }
      {inputs == null ? null :
        <>
        <Input type="hidden" name="inputParams" value={inputParams} />
        <div id="inputFields">
        {inputs.map((input, index) => (
          <>
            <Text>{input['name']}</Text>
            <Input onChange={onInputChange} />
          </>
        ))}
        </div>
        </>
      }

    </>
  );
}
