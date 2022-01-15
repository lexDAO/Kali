import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuGroup,
  IconButton,
} from "@chakra-ui/react";
import { TiThMenu } from "react-icons/ti";

export default function Hamburger() {
  return (
    <div id="nav-hamburger">
    <Menu isLazy>
      <MenuButton
        as={IconButton}
        aria-label="Information Menu"
        icon={<TiThMenu />}
        variant="ghost"
        transition="all 0.2s"
        _hover={{ bg: "kali.400" }}
        _expanded={{ bg: "kali.400" }}
      />
      <MenuList>
        <MenuGroup title="General">
          <MenuItem _focus={{ bg: "kali.700" }}>My DAOs</MenuItem>
          <MenuItem _focus={{ bg: "kali.700" }}>Tools</MenuItem>
          {/*TODO: Add Tools Sub-Menu*/}
        </MenuGroup>
        <MenuGroup title="Help">
          <MenuItem _focus={{ bg: "kali.700" }}>FAQs</MenuItem>
          <MenuItem _focus={{ bg: "kali.700" }}>Docs</MenuItem>
          <MenuItem _focus={{ bg: "kali.700" }}>Support</MenuItem>
        </MenuGroup>
      </MenuList>
    </Menu>
    </div>
  );
}
