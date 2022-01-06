import React, { useState, useContext, useEffect } from "react";
import AppContext from "../../context/AppContext";
import { FormErrorMessage, FormLabel, FormControl, Input, VStack, Button, Text, List, ListItem, IconButton } from "@chakra-ui/react";
import { AiOutlineDelete } from "react-icons/ai";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { supportedChains } from "../../constants/supportedChains";
import { getNetworkName, toDecimals, fromDecimals } from "../../utils/formatters";

export default function ChooseMembers(props) {
  const value = useContext(AppContext);
  const { web3, chainId, loading, account } = value.state;

  const {
    handleSubmit,
    register,
    control,
    formState: { errors, isSubmitting },
  } = useForm();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "founders",
  });

  useEffect(() => {
    if(props.details['members'] == null) {
      append({ address: "" });
    } else {
      for(let i=0; i < props.details['members'].length; i++) {
        append({ address: props.details['members'][i], share: fromDecimals(props.details['shares'][i], 18) });
      }
    }

  }, []);

  const handleMembersSubmit = async (values) => {
    console.log("Form: ", values);

    const {
      founders
    } = values;

    // convert shares to wei
    let sharesArray = [];
    for (let i = 0; i < founders.length; i++) {
      sharesArray.push(toDecimals(founders[i].share, 18));
    }
    console.log("Shares Array", sharesArray);

    let votersArray = [];
    for (let i = 0; i < founders.length; i++) {
      if(web3.utils.isAddress(founders[i].address) == false) {
        value.toast(founders[i].address + " is not a valid Ethereum address.");
        return;
      }
      votersArray.push(founders[i].address);
    }
    console.log("Voters Array", votersArray)

    let array = props.details;
    array['members'] = votersArray;
    array['shares'] = sharesArray;
    props.setDetails(array);
    console.log(props.details)

    props.handleNext(5);
  };

  return (
    <VStack as="form" onSubmit={handleSubmit(handleMembersSubmit)}>
      <Text fontSize="xl"><b>Add your founders to cap table</b></Text>
      <List spacing={2}>
        {fields.map((founder, index) => (
          <ListItem
            display="flex"
            flexDirection="row"
            alignContent="center"
            justifyContent="center"
            key={founder.id}
          >
            <Controller
              name={`founders.${index}.address`}
              control={control}
              defaultValue={founder.address}
              render={({ field }) => (
                <FormControl isRequired>
                  <FormLabel htmlFor={`founders.${index}.address`}>
                    Founder
                  </FormLabel>
                  <Input
                    placeholder="0x address or ENS"
                    {...field}
                    {...register(`founders.${index}.address`, {
                      required: "You must assign share!",
                    })}
                  />
                </FormControl>
              )}
            />
            <Controller
              name={`founders.${index}.share`}
              control={control}
              defaultValue={founder.share}
              render={({ field }) => (
                <FormControl isRequired>
                  <FormLabel htmlFor={`founders.${index}.share`}>
                    Share {index + 1}
                  </FormLabel>
                  <Input
                    placeholder="1"
                    {...field}
                    {...register(`founders.${index}.share`, {
                      required: "You must assign share!",
                    })}
                  />
                </FormControl>
              )}
            />
            <IconButton
              aria-label="delete founder"
              isRound
              variant="ghost"
              _hover={{ bg: "kali.600" }}
              mt={8}
              ml={2}
              icon={<AiOutlineDelete />}
              onClick={() => remove(index)}
            />
          </ListItem>
        ))}
      </List>
      <Button onClick={() => append({ address: "" })}>Add Founder</Button>
      <Button type="submit">Next</Button>
    </VStack>
  );
}
