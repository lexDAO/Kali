import { useState, useContext, useEffect } from "react";
import Router, { useRouter } from "next/router";
import AppContext from "../../context/AppContext";
import { Input, Button, Select, Text, Textarea, Stack, List, ListItem, FormControl, FormLabel } from "@chakra-ui/react";
import NumInputField from "../elements/NumInputField";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { toDecimals } from "../../utils/formatters";
import { tokens } from "../../constants/tokens";

export default function SendToken() {
  const value = useContext(AppContext);
  const { web3, loading, account, abi, address, dao } = value.state;
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleSelect = (select) => {
    let value = select.target.value;
    let id = select.target.id;
    var array = selectedOptions;
    array[id] = value;
    setSelectedOptions(array);
    console.log(array);
  }

  const {
    handleSubmit,
    register,
    control,
    formState: { errors, isSubmitting },
  } = useForm();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "recipients",
  });

  useEffect(() => {
    append({ address: "" }); // add first recipient input field
  }, []);

  const submitProposal = async (values) => {
    //event.preventDefault();
    value.setLoading(true);
    console.log("event", event)
    try {

      var {
        description_,
        recipients
      } = values; // this must contain any inputs from custom forms
      console.log("values", values)

      const proposalType_ = 2;

      let amounts_ = [];
      for (let i = 0; i < recipients.length; i++) {
        amounts_.push(0);
      }
      console.log("Amounts Array", amounts_);

      // voters ENS check
      let accounts_ = [];
      for (let i = 0; i < recipients.length; i++) {
        let tokenIndex = selectedOptions[i];
        let address_ = tokens[tokenIndex]["address"];
        accounts_.push(address_);
      }
      console.log("Tokens Array", accounts_);

      let payloads_ = [];
      for (let i = 0; i < recipients.length; i++) {
        const ierc20 = require("../../abi/ERC20.json");
        let tokenIndex = selectedOptions[i];
        let address_ = tokens[tokenIndex]["address"];
        let decimals = tokens[tokenIndex]["decimals"];
        let amt = toDecimals(recipients[i].share, decimals).toString();
        console.log("amt",amt)
        const tokenContract = new web3.eth.Contract(ierc20, address_);
        var payload_ = tokenContract.methods
          .transfer(recipients[i].address, amt)
          .encodeABI();
        payloads_.push(payload_);
      }

      console.log(payloads_);

      const instance = new web3.eth.Contract(abi, address);

      try {
        let result = await instance.methods
          .propose(
            proposalType_,
            description_,
            accounts_,
            amounts_,
            payloads_
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
    <form onSubmit={handleSubmit(submitProposal)}>
      <Stack>

      <Controller
        name="description_"
        control={control}
        render={({ field }) => (
          <FormControl>
            <FormLabel htmlFor="description_">Description</FormLabel>
            <Textarea
              placeholder="0x address or ENS"
              {...field}
              {...register(`description_`, {
                required: "Please enter a description.",
              })}
            />
          </FormControl>
        )}
      />

      <List spacing={2}>
        {fields.map((recipient, index) => (
          <ListItem
            display="flex"
            flexDirection="row"
            alignContent="center"
            justifyContent="center"
            key={recipient.id}
          >
            <Controller
              name={`recipients.${index}.address`}
              control={control}
              defaultValue={recipient.address}
              render={({ field }) => (
                <FormControl>
                  <FormLabel htmlFor={`recipients.${index}.address`}>
                    Recipient {index + 1}
                  </FormLabel>
                  <Input
                    placeholder="0x address or ENS"
                    {...field}
                    {...register(`recipients.${index}.address`, {
                      required: "You must assign share!",
                    })}
                  />
                </FormControl>
              )}
            />
            <Controller
              name={`recipients.${index}.token`}
              control={control}
              defaultValue={recipient.token}
              render={({ field }) => (
                <FormControl>
                  <FormLabel htmlFor={`recipients.${index}.token`}>
                    Token
                  </FormLabel>
                  <Select id={index} onChange={handleSelect}>
                      <option>Select a token</option>
                    {dao["balances"].map((b, index) => (
                      <option key={index} value={index}>
                        {b["token"]}
                      </option>
                    ))}
                  </Select>
                </FormControl>
              )}
            />
            <Controller
              name={`recipients.${index}.share`}
              control={control}
              defaultValue={recipient.share}
              render={({ field }) => (
                <FormControl>
                  <FormLabel htmlFor={`recipients.${index}.share`}>
                    Share
                  </FormLabel>
                  <Input
                    placeholder="1"
                    {...field}
                    {...register(`recipients.${index}.share`, {
                      required: "You must assign share!",
                    })}
                  />
                </FormControl>
              )}
            />

            <Button variant="ghost" onClick={() => remove(index)}>
              X
            </Button>
          </ListItem>
        ))}
      </List>

      <Button onClick={() => append({ address: "" })}>Add Recipient</Button>

        <Button type="submit">Submit Proposal</Button>
      </Stack>
    </form>
  );
}
