import {
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";

export default function NumInputField(props) {

  let min;
  if(props.min) {
    min = props.min;
  }else {
    min = 1;
  }

  return (

      <NumberInput name={props.name} size="lg" defaultValue={1} min={min}>

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
