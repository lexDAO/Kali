import { useState, useContext, useEffect } from "react";
import AppContext from "../../context/AppContext";
import {
  Select,
  Text,
  Box,
  Grid,
  LinkBox,
  LinkOverlay,
  Heading,
  Divider,
  Button,
} from "@chakra-ui/react";
import FlexOutline from "../elements/FlexOutline";
import { BrowserView, MobileView } from "react-device-detect";
import { newProposalHelper } from "../../utils/newProposalHelper";
import { hideAlert } from "../../utils/helpers";

export default function NewProposal(props) {
  const [menuItem, setMenuItem] = useState(999); // arbitrary number where no proposal type is selected. if changed, must change below, too
  const value = useContext(AppContext);
  const { web3, loading, account, abi, address, extensions, chainId } = value.state;
  const balances = props.balances;

  const handleClick = () => {
    setMenuItem(999);
    hideAlert();
  }

  const ProposalTile = (props) => {
    return (
      <LinkBox
        bgGradient="linear(to-br, kali.400, kali.100)"
        p={5}
        m={2}
        borderRadius="2xl"
        boxShadow="dark-lg"
        _hover={{
          bgGradient: "linear(to-br, kali.100, kali.400)",
        }}
      >
        <LinkOverlay href="#" onClick={() => setMenuItem(props.id)}>
          <Heading
            size="md"
            fontWeight="extrabold"
            color="#080800"
            textTransform="uppercase"
          >
            {props.title}
          </Heading>
        </LinkOverlay>
        <Text color="#292929">{props.description}</Text>
      </LinkBox>
    );
  };

  const updateMenuItem = (e) => {
    let newValue = e.target.value;
    setMenuItem(newValue);
  };

  const BackButton = () => {
    return (
      <Button size="sm" onClick={handleClick} marginBottom={5}>
        « Back
      </Button>
    );
  };

  return (
    <>
      <MobileView>
        <form>
          <FlexOutline>
            <Select
              name="menuItem" // will have to convert to proposalType corresponding with smart contract enums
              onChange={updateMenuItem}
              color="kali.800"
              bg="kali.900"
              opacity="0.9"
            >
              <option value="999">Select a proposal type</option>
              {newProposalHelper.map((p, index) => (
                p[3]==null || (extensions[p[3]] != null && extensions[p[3]] != "0x0000000000000000000000000000000000000000") ?
                <option key={index} value={index}>
                  {p[0]}
                </option>
                : null
              ))}
            </Select>
          </FlexOutline>
        </form>
      </MobileView>
      <BrowserView>
        {menuItem < 999 ? (
          <BackButton />
        ) : (
          <Grid
            templateColumns={{
              sm: "repeat(1, 1fr)",
              md: "repeat(2, 1fr)",
              lg: "repeat(4, 1fr)",
            }}
          >
            {newProposalHelper.map((p, index) => (
              p[3]==null || (extensions[p[3]] != null && extensions[p[3]] != "0x0000000000000000000000000000000000000000") ?
              <ProposalTile
                key={index}
                id={index}
                title={p[0]}
                description={p[1]}
              />
              :
              null
            ))}
          </Grid>
        )}
      </BrowserView>

      {newProposalHelper.map((row, index) =>
        menuItem == index ? (
          <Box p={5} border="1px solid">
            {row[2]}
          </Box>
        ) : null
      )}
    </>
  );
}
