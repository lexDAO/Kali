import {
  IconButton
} from "@chakra-ui/react";
import { BiRefresh } from "react-icons/bi";

export default function Reload() {
  return(
    <IconButton
      border="0px"
      size="sm"
      aria-label="refresh"
      icon={<BiRefresh />}
      onClick={value.reloadButton}
    />
  );
}
