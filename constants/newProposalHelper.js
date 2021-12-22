// components
import SendShares from "../components/newproposal/SendShares";
import RemoveMember from "../components/newproposal/RemoveMember";
import SendToken from "../components/newproposal/SendToken";
import ContractCall from "../components/newproposal/ContractCall";
import GovernanceSettings from "../components/newproposal/GovernanceSettings";
import Extensions from "../components/newproposal/Extensions";
import Tribute from "../components/newproposal/Tribute";
import BuyCrowdsale from "../components/newproposal/BuyCrowdsale";
import Redemption from "../components/newproposal/Redemption";
import Escape from "../components/newproposal/Escape";

// populates tiles on desktop view of New Proposal view
export const newProposalHelper = [
  {
    title: "Send Shares",
    description: "Add a new member, or send more shares to an existing member.",
    component: <SendShares />,
    extension: null,
  },
  {
    title: "Send a Token",
    description:
      "Send an ERC20 token from the DAO treasury to an ETH wallet or another smart contract.",
    component: <SendToken />,
    extension: null,
  },
  {
    title: "Call a Contract",
    description: "Integrate with another smart contract.",
    component: <ContractCall />,
    extension: null,
  },
  {
    title: "Governance Settings",
    description:
      "Adjust the DAO's voting period, quorum, supermajority, and share transferability.",
    component: <GovernanceSettings />,
    extension: null,
  },
  {
    title: "Extensions",
    description: "Add, remove, and configure extensions.",
    component: <Extensions />,
    extension: null,
  },
  {
    title: "Remove Member",
    description:
      "Propose removal of a member due to misconduct or wallet hack.",
    component: <RemoveMember />,
    extension: null,
  },
  {
    title: "Tribute",
    description: "Propose joining the DAO, and send tribute.",
    component: <Tribute />,
    extension: "tribute",
  },
  {
    title: "Buy Crowdsale",
    description: "Join the DAO through crowdsale.",
    component: <BuyCrowdsale />,
    extension: "crowdsale",
  },
  {
    title: "Redeem Shares",
    description: "Leave the DAO and get your share of treasury assets.",
    component: <Redemption />,
    extension: "redemption",
  },
];
