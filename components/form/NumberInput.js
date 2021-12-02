/* eslint-disable react/no-children-prop */
import React from "react";
import { Field } from "formik";
import {
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  FormControl,
  FormLabel,
  FormErrorMessage,
} from "@chakra-ui/react";

function CustomNumberInput(props) {
  const { label, name, ...rest } = props;
  return (
    <Field name={name}>
      {({ field, form }) => {
        return (
          <FormControl isInvalid={form.errors[name] && form.touched[name]}>
            <FormLabel htmlFor={name}>{label}</FormLabel>
            <NumberInput
              name={name}
              {...rest}
              onChange={(val) => form.setFieldValue(field.name, val)}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper
                  bg="green.600"
                  _active={{ bg: "green.500" }}
                  children="+"
                />
                <NumberDecrementStepper
                  bg="red.600"
                  _active={{ bg: "red.500" }}
                  children="-"
                />
              </NumberInputStepper>
            </NumberInput>
            <FormErrorMessage>{form.errors[name]}</FormErrorMessage>
          </FormControl>
        );
      }}
    </Field>
  );
}

export default CustomNumberInput;
