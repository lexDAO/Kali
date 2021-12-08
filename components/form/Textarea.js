import React from "react";
import { Field } from "formik";
import {
  Textarea,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Icon
} from "@chakra-ui/react";
import { BsFillExclamationCircleFill } from "react-icons/bs";

function CustomTextarea(props) {
  const { label, name, ...rest } = props;

  return (
    <Field name={name}>
      {({ field, form }) => {
        return (
          <FormControl isInvalid={form.errors[name] && form.touched[name]}>
            <FormLabel htmlFor={name}>{label}</FormLabel>
            <Textarea id={name} name={name} {...rest} {...field} />
            {/*TODO: Add Icon to ErrorMessage*/}
            <FormErrorMessage>
              <Icon as={BsFillExclamationCircleFill} w={4} h={4} mr={1} />
               {form.errors[name]}
            </FormErrorMessage>
          </FormControl>
        );
      }}
    </Field>
  );
}

export default CustomTextarea;
