import { useState, useContext, useEffect } from "react";
import Router, { useRouter } from "next/router";
import AppContext from "../../context/AppContext";
import {
  Input,
  Button,
  Select,
  Text,
  Textarea,
  Stack,
  HStack,
  List,
  ListItem,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import NumInputField from "../elements/NumInputField";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { toDecimals } from "../../utils/formatters";

export default function SendShares() {
  const value = useContext(AppContext);
  const { web3, loading, account, address, chainId, abi } = value.state;

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
    value.setLoading(true);

    try {
      var { description_, recipients } = values; // this must contain any inputs from custom forms
      console.log(values);
      let amounts_ = [];
      for (let i = 0; i < recipients.length; i++) {
        amounts_.push(toDecimals(recipients[i].share, 18).toString());
      }
      console.log("Shares Array", amounts_);

      // voters ENS check
      let accounts_ = [];
      for (let i = 0; i < recipients.length; i++) {
        accounts_.push(recipients[i].address);
      }
      console.log("Voters Array", accounts_);

      const proposalType_ = 0;

      let payloads_ = [];
      for (let i = 0; i < recipients.length; i++) {
        payloads_.push("0x");
      }
      console.log(payloads_);
      console.log(
        proposalType_,
        description_,
        accounts_,
        amounts_,
        payloads_
      );
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
        <Text>
          <b>Details</b>
        </Text>

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
