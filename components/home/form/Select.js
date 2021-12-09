import React from "react";
import { Field } from "formik";
import {
  Input,
  Select,
  FormControl,
  FormLabel,
  FormErrorMessage,
} from "@chakra-ui/react";
import { BsFillExclamationCircleFill } from "react-icons/bs";

function CustomSelect(props) {
  const { label, name, options, ...rest } = props;
  return (
    <Field name={name}>
      {({ field, form }) => {
        return (
          <FormControl isInvalid={form.errors[name] && form.touched[name]}>
            <FormLabel htmlFor={name}>{label}</FormLabel>
            <Select
              name={name}
              {...rest}
              {...field}
              color="kali.800"
              bg="kali.900"
              opacity="0.90"
            >
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.key}
                </option>
              ))}
            </Select>
            <FormErrorMessage>
              {<BsFillExclamationCircleFill />} {form.errors[name]}
            </FormErrorMessage>
          </FormControl>
        );
      }}
    </Field>
  );
}

export default CustomSelect;
