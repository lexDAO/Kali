import GovPeriod from "../components/newproposal/GovPeriod";
import GovQuorum from "../components/newproposal/GovQuorum";
import GovSupermajority from "../components/newproposal/GovSupermajority";
import GovPause from "../components/newproposal/GovPause";
import GovVotingSettings from "../components/newproposal/GovVotingSettings";

// populates select menu for gov settings proposal type
export const govSettingsHelper = [
  // key = proposalType
  {
    proposalType: 3,
    text: "Voting Period",
    component: <GovPeriod />,
  },
  {
    proposalType: 4,
    text: "Quorum",
    component: <GovQuorum />,
  },
  {
    proposalType: 5,
    text: "Supermajority",
    component: <GovSupermajority />,
  },
  {
    proposalType: 6,
    text: "Voting Settings for Proposal Type",
    component: <GovVotingSettings />,
  },
  {
    proposalType: 7,
    text: "Pause/Unpause Share Transferability",
    component: <GovPause />,
  },
];
