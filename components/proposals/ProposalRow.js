import { useContext, useState, useEffect } from "react";
import AppContext from "../../context/AppContext";
import {
  Input,
  Button,
  Text,
  Heading,
  Flex,
  Box,
  Icon,
  Stack,
  HStack,
  VStack,
  Center,
  Divider,
  Modal,
  Progress,
  Spacer
} from "@chakra-ui/react";
import FlexOutline from "../elements/FlexOutline";
import Timer from "./Timer";
import { useClipboard } from "@chakra-ui/react";
import ProposalModal from "./ProposalModal";
import ProposalIcon from "./ProposalIcon";
import ProcessModule from "./ProcessModule";
import Sponsor from "./Sponsor";
import { useDisclosure } from "@chakra-ui/react";
import { viewProposalsHelper } from "../../constants/viewProposalsHelper";
import { fromDecimals } from "../../utils/formatters";

export default function ProposalRow(props) {
  const value = useContext(AppContext);
  const { web3, loading, account } = value.state;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [votingStarted, setVotingStarted] = useState(false);
  const [isExpired, setIsExpired] = useState(false);
  const p = props["p"];
  const i = props["i"];
  let now = Math.round(Date.now() / 1000);
  let buffer = p["creationTime"] + 20;

  useEffect(() => {
    if (p["open"] == false) {
      setIsExpired(true);
    }
    if (now >= buffer) {
      setVotingStarted(true);
    }
  }, []);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ProposalModal p={p} i={i} isExpired={isExpired} />
      </Modal>

      <Box
        className="proposal-tile gradient-item"
      >
        <VStack>
          <HStack className="proposal-title" width="100%">
            <ProposalIcon p={p} />
            <Heading>
              {viewProposalsHelper[p["proposalType"]]["title"]}
            </Heading>
          </HStack>
          {p["pending"] == true ? (
            <Text casing="uppercase">needs sponsor</Text>
          ) : null}

          <HStack width="100%" className="timer-container">
            <Text className="timer-label">remaining:</Text>
            <Spacer />
            <Timer
              expires={p["expires"]}
              open={p["open"]}
              isExpired={isExpired}
              setVotingStarted={setVotingStarted}
              setIsExpired={setIsExpired}
              buffer={buffer}
            />
          </HStack>

          <HStack width="100%">
          <VStack className="vote-count">
            <Text>YES</Text>
            <Text>{fromDecimals(p["yesVotes"], 18)}</Text>
          </VStack>
          <Progress
            width="100%"
            colorScheme="teal"
            backgroundColor="transparent"
            border="1px solid"
            value={p["progress"]}
            rounded={10}
          />
          <VStack className="vote-count">
            <Text>NO</Text>
            <Text>{fromDecimals(p["noVotes"], 18)}</Text>
          </VStack>
          </HStack>
          <Text className="vote-status">{p["passing"]}</Text>

          <HStack>
            <Button className="transparent-btn" key={p["id"]} onClick={onOpen} isDisabled={!votingStarted}>
              {isExpired == true ? "Details" : "Review & Vote"}
            </Button>
            {isExpired == true && p["pending"] == false ? (
              account == null ? <Text><i>Please connect to your account to vote.</i></Text>
              :
              <ProcessModule i={i} p={p} />
            ) : null}
            {p["pending"] == true ? <Sponsor i={i} p={p} /> : null}
          </HStack>
        </VStack>
      </Box>
    </>
  );
}
