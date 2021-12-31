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
  Center,
  VStack,
  Button,
  Flex,
} from "@chakra-ui/react";
import { BrowserView, MobileView } from "react-device-detect";
import { newProposalHelper } from "../../constants/newProposalHelper";
import ConnectWallet from "./ConnectWallet";
import Account from "../structure/Account";

export default function NewProposal(props) {
  const [menuItem, setMenuItem] = useState(999); // arbitrary number where no proposal type is selected. if changed, must change below, too
  const value = useContext(AppContext);
  const { web3, loading, account, abi, address, dao, chainId } = value.state;
  const balances = props.balances;
  console.log("account", account);

  const handleClick = () => {
    setMenuItem(999);
  };

  const ProposalTile = (props) => {
    return (
      <LinkBox
        bg="kali.900"
        border="1px solid"
        p={5}
        m={2}
        borderRadius="2xl"
        //boxShadow="lg"
        _hover={{
          bgGradient: "linear(to-br, kali.600, kali.700)",
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
      {dao == null ? null : account == null ? (
        <Account
          isFullWidth
          mt={10}
          message="Please connect your wallet to start making proposals!"
        />
      ) : (
        <>
          <MobileView>
            <form>
              <Flex>
                <Select
                  name="menuItem" // will have to convert to proposalType corresponding with smart contract enums
                  onChange={updateMenuItem}
                  color="kali.800"
                  bg="kali.900"
                  opacity="0.9"
                >
                  <option value="999">Select a proposal type</option>
                  {Object.entries(newProposalHelper).map(([k, v]) =>
                    newProposalHelper[k]["extension"] == null ||
                    ("extensions" in dao &&
                      dao["extensions"] != null &&
                      newProposalHelper[k]["extension"] in
                        dao["extensions"]) ? (
                      <option key={`option-${k}`} value={k}>
                        {newProposalHelper[k]["title"]}
                      </option>
                    ) : null
                  )}
                </Select>
              </Flex>
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
                {Object.entries(newProposalHelper).map(([k, v]) =>
                  newProposalHelper[k]["extension"] == null ||
                  ("extensions" in dao &&
                    dao["extensions"] != null &&
                    newProposalHelper[k]["extension"] in dao["extensions"]) ? (
                    <ProposalTile
                      key={`propTile-${k}`}
                      id={k}
                      title={newProposalHelper[k]["title"]}
                      description={newProposalHelper[k]["description"]}
                    />
                  ) : null
                )}
              </Grid>
            )}
          </BrowserView>

          {Object.entries(newProposalHelper).map(([k, v]) =>
            menuItem == k ? (
              <Box key={`component-${k}`} p={5} border="1px solid">
                {newProposalHelper[k]["component"]}
              </Box>
            ) : null
          )}
        </>
      )}
    </>
  );
}
