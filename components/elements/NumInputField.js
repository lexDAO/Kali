import {
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";

export default function NumInputField(props) {

  let min;
  let max;
  let onChange;
  let defaultValue;
  if(props.min) {
    min = props.min;
  }else {
    min = 1;
  }
  if(props.max) {
    max = props.max;
  }else {
    max = 2e256 - 1;
  }
  if(props.onChange) {
    onChange=props.onChange;
  }
  if(props.defaultValue) {
    defaultValue=props.defaultValue;
  } else {
    defaultValue=0;
  }

  return (

      <NumberInput name={props.name} size="lg" defaultValue={defaultValue} min={min} max={max} onChange={onChange}>

        <NumberInputField focusBorderColor="red.200" />

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

  );
}
