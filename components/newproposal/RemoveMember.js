import { useState, useContext, useEffect } from "react";
import Router, { useRouter } from "next/router";
import AppContext from "../../context/AppContext";
import { Input, Button, Select, Text, Textarea, Stack, List, ListItem, FormControl, FormLabel } from "@chakra-ui/react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import NumInputField from "../elements/NumInputField";

export default function SendShares() {
  const value = useContext(AppContext);
  const { web3, loading, account, abi, address } = value.state;

  const {
    handleSubmit,
    register,
    control,
    formState: { errors, isSubmitting },
  } = useForm();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "members",
  });

  useEffect(() => {
    append({ address: "" }); // add first member input field
  }, []);

  const submitProposal = async (values) => {
    event.preventDefault();
    value.setLoading(true);

    try {

      var { description_, members } = values; // this must contain any inputs from custom forms

      let accounts_ = [];
      for (let i = 0; i < members.length; i++) {
        accounts_.push(members[i].address);
      }
      console.log("Voters Array", accounts_);

      const proposalType_ = 1;

      const instance = new web3.eth.Contract(abi, address);

      let amounts_ = [];
      for (let i = 0; i < members.length; i++) {
        const amount_ = await instance.methods.balanceOf(members[i].address).call();
        amounts_.push(amount_);
      }
      console.log("Shares Array", amounts_);

      let payloads_ = [];
      for (let i = 0; i < accounts_.length; i++) {
        payloads_.push("0x");
      }

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
        {fields.map((member, index) => (
          <ListItem
            display="flex"
            flexDirection="row"
            alignContent="center"
            justifyContent="center"
            key={member.id}
          >
            <Controller
              name={`members.${index}.address`}
              control={control}
              defaultValue={member.address}
              render={({ field }) => (
                <FormControl>
                  <FormLabel htmlFor={`members.${index}.address`}>
                    member {index + 1}
                  </FormLabel>
                  <Input
                    placeholder="0x address or ENS"
                    {...field}
                    {...register(`members.${index}.address`, {
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

      <Button onClick={() => append({ address: "" })}>Add Member</Button>

        <Button type="submit">Submit Proposal</Button>
      </Stack>
    </form>
  );
}
