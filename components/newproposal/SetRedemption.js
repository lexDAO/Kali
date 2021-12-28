import React, { useState, useContext, useEffect } from "react";
import Router, { useRouter } from "next/router";
import AppContext from "../../context/AppContext";
import { Input, Button, Text, Textarea, Stack, Select, Checkbox, CheckboxGroup, HStack } from "@chakra-ui/react";
import NumInputField from "../elements/NumInputField";
import DateSelect from "../elements/DateSelect";
import { addresses } from "../../constants/addresses";
import { tokens } from "../../constants/tokens";

export default function SetRedemption() {
  const value = useContext(AppContext);
  const { web3, loading, account, abi, address, chainId, dao, daoChain } = value.state;
  const [startDate, setStartDate] = useState(new Date());
  const [checked, setChecked] = useState();

  useEffect(() => {
    let array = [];
    for(var i=0; i < tokens.length; i++) {
      array.push(false);
    }
    setChecked(array);
  }, []);

  const handleCheck = (e) => {
    let id = e.target.id;
    let array = checked;
    array[id] = !array[id];
    setChecked(array);
    console.log(array)
  }

  const submitProposal = async (event) => {
    event.preventDefault();
    value.setLoading(true);

    try {
      let object = event.target;

      var array = [];
      for (let i = 0; i < object.length; i++) {
        array[object[i].name] = object[i].value;
        console.log(object[i].value)
      }

      var {
        description_,
        account_,
        proposalType_,
        redemptionStart_,
      } = array; // this must contain any inputs from custom forms
      console.log(array)

      var amount_ = 0;

      if (dao["extensions"]["redemption"] == null) {
        amount_ = 1; // prevent toggling extension back off
      }
      console.log("amount:" + amount_);

      const tokenArray = [];
      for(var i=0; i < tokens.length; i++) {
        if(checked[i]==true) {
          tokenArray.push(tokens[i]["address"])
        }
      }

      console.log(tokenArray);

      redemptionStart_ = new Date(redemptionStart_).getTime() / 1000;

      const payload_ = web3.eth.abi.encodeParameters(
        ["address[]", "uint256"],
        [tokenArray, redemptionStart_]
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
        console.log(e);
      }
    } catch (e) {
      value.toast(e);
      value.setLoading(false);
      console.log(e);
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
          <b>Tokens for Redemption</b>
        </Text>

        <CheckboxGroup colorScheme='green'>
          <HStack>
            {tokens.map((token, index) => (
              <Checkbox
                name={`tokens_[${index}]`}
                id={index}
                key={index}
                value={token['address']}
                isChecked={`checked[${index}]`}
                onChange={handleCheck}
                >{token['token']}</Checkbox>
            ))}
          </HStack>
        </CheckboxGroup>

        <Text>Redemption Start</Text>

        <DateSelect name="redemptionStart_" />

        <Input type="hidden" name="proposalType_" value="8" />
        <Input
          type="hidden"
          name="account_"
          value={addresses[daoChain]["extensions"]["redemption"]}
        />

        <Button type="submit">Submit Proposal</Button>
      </Stack>
    </form>
  );
}
