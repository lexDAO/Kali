// these MUST be in same order as in Solidity contract

export const proposalTypes = [
  "MINT",
  "BURN",
  "CALL",
  "PERIOD",
  "QUORUM",
  "SUPERMAJORITY",
  "TYPE",
  "PAUSE",
  "EXTENSION",
  "ESCAPE",
  "DOCS"
];

export const voteTypes = [
  "SIMPLE_MAJORITY",
  "SIMPLE_MAJORITY_QUORUM_REQUIRED",
  "SUPERMAJORITY",
  "SUPERMAJORITY_QUORUM_REQUIRED"
];

export const votingPeriodUnits = ["minutes", "hours", "days"];
