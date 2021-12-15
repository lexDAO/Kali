import SendShares from "../components/newproposal/SendShares";
import RemoveMember from "../components/newproposal/RemoveMember";
import SendToken from "../components/newproposal/SendToken";
import ContractCall from "../components/newproposal/ContractCall";
import GovernanceSettings from "../components/newproposal/GovernanceSettings";
import GovPeriod from "../components/newproposal/GovPeriod";
import GovQuorum from "../components/newproposal/GovQuorum";
import GovSupermajority from "../components/newproposal/GovSupermajority";
import GovPause from "../components/newproposal/GovPause";
import GovVotingSettings from "../components/newproposal/GovVotingSettings";
import Extensions from "../components/newproposal/Extensions";

export const newProposalHelper = [ // title, description, component
  ["Send Shares", "Add a new member, or send more shares to an existing member.", <SendShares />],
  ["Send a Token", "Send an ERC20 token from the DAO treasury to an ETH wallet or another smart contract.", <SendToken />],
  ["Call a Contract", "Integrate with another smart contract.", <ContractCall />],
  ["Governance Settings", "Adjust the DAO's voting period, quorum, supermajority, and share transferability.", <GovernanceSettings />],
  ["Extensions", "Add, remove, and configure extensions.", <Extensions />],
  ["Remove Member", "Propose removal of member due to misconduct or wallet hack.", <RemoveMember />],
]

export const govSettingsHelper = [ // solidity enum id, description, component
  [3, "Voting Period", <GovPeriod />],
  [4, "Quorum", <GovQuorum />],
  [5, "Supermajority", <GovSupermajority />],
  [6, "Voting Settings for Proposal Type", <GovVotingSettings />],
  [7, "Pause/Unpause Share Transferability", <GovPause />]
]
