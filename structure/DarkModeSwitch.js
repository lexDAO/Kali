import React from "react";
import { useColorMode, IconButton } from "@chakra-ui/react";
import { BsSunFill, BsMoonFill } from "react-icons/bs";

function DarkModeSwitch() {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <IconButton
      aria-label="Toggle Dark Switch"
      variant="ghost"
      _hover={{ bg: "kali.400" }}
      icon={colorMode === "dark" ? <BsSunFill /> : <BsMoonFill />}
      onClick={toggleColorMode}
    />
  );
}

export default DarkModeSwitch;
