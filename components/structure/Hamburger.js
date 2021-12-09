import { IconButton } from "@chakra-ui/react";
import { AiOutlineEllipsis } from "react-icons/ai";

export default function Hamburger() {

  return (
    <IconButton
      aria-label="Menu"
      variant="ghost"
      icon={<AiOutlineEllipsis />}
    />
  );
}
