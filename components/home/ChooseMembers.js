import React, { useState, useContext, useEffect } from "react";
import AppContext from "../../context/AppContext";
import { FormErrorMessage, FormLabel, FormControl, Input, VStack, Button, Text, Heading, List, ListItem, IconButton } from "@chakra-ui/react";
import { AiOutlineDelete } from "react-icons/ai";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { supportedChains } from "../../constants/supportedChains";
import { getNetworkName, toDecimals, fromDecimals } from "../../utils/formatters";
import NumInputField from "../elements/NumInputField";

export default function ChooseMembers(props) {
  const value = useContext(AppContext);
  const { web3, chainId, loading, account } = value.state;
  const [defaults, setDefaults] = useState([]);

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
      setDefaults([1]);
    } else {
      for(let i=0; i < props.details['members'].length; i++) {
        append({ address: props.details['members'][i], share: fromDecimals(props.details['shares'][i], 18) });
        let array = defaults;
        array[i] = fromDecimals(props.details['shares'][i], 18);
        setDefaults(array);
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

    for(let i=0; i < founders.length; i++) {
      let element = document.getElementById(`founders.${i}.share`);
      let value = element.value;
      sharesArray.push(toDecimals(value, 18));
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

    props.handleNext();
  };

  return (
    <VStack as="form" onSubmit={handleSubmit(handleMembersSubmit)}>
      <Heading as="h1"><b>Build your cap table:</b></Heading>
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
                    className="member-address"
                    placeholder="0x address"
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
                    Shares
                  </FormLabel>
                  <NumInputField
                    min="1"
                    defaultValue={defaults[index]}
                    id={`founders.${index}.share`}
                    />
                </FormControl>
              )}
            />
            <IconButton
              className="delete-icon"
              aria-label="delete founder"
              mt={8}
              ml={2}
              icon={<AiOutlineDelete />}
              onClick={() => remove(index)}
            />
          </ListItem>
        ))}
      </List>
      <Button className="transparent-btn" onClick={() => append({ address: "" })}>+ Add Founder</Button>
      <Button className="transparent-btn" type="submit">Next »</Button>
    </VStack>
  );
}
