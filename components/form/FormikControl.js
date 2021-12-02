import React from "react";
import CustomInput from "./Input";
import CustomTextarea from "./Textarea";
import CustomSelect from "./Select";
import CustomNumberInput from "./NumberInput";

function FormikControl(props) {
  const { control, ...rest } = props;
  switch (control) {
    case "input":
      return <CustomInput {...rest} />;
    case "textarea":
      return <CustomTextarea {...rest} />;
    case "select":
      return <CustomSelect {...rest} />;
    case "number-input":
      return <CustomNumberInput {...rest} />;
    default:
      return null;
  }
}

export default FormikControl;
