import ReactDOM from "react-dom";
import {
  Box,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CloseButton,
  VStack,
} from "@chakra-ui/react";

export default function alert(props) {
  const messages = [];
  messages["connect"] = {
    status: "error",
    title: "You are not connected to your wallet.",
    description: "Please connect to wallet.",
  };

  messages["invalid-json"] = {
    status: "error",
    title: "Invalid JSON.",
    description: "Please input a valid JSON ABI.",
  };
  messages["send-transaction"] = {
    status: "error",
    title: "Transaction Error.",
    description:
      "Transaction failed.  Common causes include an insufficient balance to complete the transaction, invalid transaction parameters, or user account lacking necessary authorization.",
  };

  let type = props.type;
  let message = messages[type];
  let alert = document.getElementById("alert-" + type);
  let test = document.getElementById("alert");
  console.log(test);

  const closeMe = () => {
    ReactDOM.unmountComponentAtNode(document.getElementById("alert"));
  };

  return (
    <Box
      border="1px solid"
      width="50vw"
      id={`alert-${type}`}
      backgroundColor="pink"
    >
      <Alert status={message.status}>
        <VStack>
          <AlertTitle mr={2}>{message.title}</AlertTitle>
          <AlertDescription>{message.description}</AlertDescription>
        </VStack>
        <CloseButton
          position="absolute"
          right="8px"
          top="8px"
          onClick={closeMe}
        />
      </Alert>
    </Box>
  );
}
