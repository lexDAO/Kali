import { useState, useContext, useEffect } from "react";
import AppContext from "../../context/AppContext";
import {
  IconButton
} from "@chakra-ui/react";
import { BiRefresh } from "react-icons/bi";

export default function Reload(props) {
  const value = useContext(AppContext);

  return(
    <IconButton
      border="0px"
      size="sm"
      aria-label="refresh"
      icon={<BiRefresh />}
      onClick={props.reload}
      color="#5a2686"
      background="none"
    />
  );
}
