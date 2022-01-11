import { useContext } from "react";
import AppContext from "../../context/AppContext";
import { Button, Text } from "@chakra-ui/react";
import { truncateAddress } from "../../utils/formatters";

export default function Account(props) {
  const value = useContext(AppContext);
  const { account } = value.state;

  return (
    <Button
      variant="link"
      onClick={value.connect}
      id="nav-account"
    >
      {account == null ? "connect" : truncateAddress(account)}
    </Button>
  );
}
