// these MUST be in same order as in Solidity contract

export const proposalTypes = [
  "MINT",
  "BURN",
  "CALL",
  "PERIOD",
  "QUORUM",
  "SUPERMAJORITY",
  "PAUSE",
  "EXTENSION"
];

export const voteTypes = [
  "SIMPLE_MAJORITY",
  "SIMPLE_MAJORITY_QUORUM_REQUIRED",
  "SUPERMAJORITY",
  "SUPERMAJORITY_QUORUM_REQUIRED"
];

export const proposalDescriptions = [
  "send shares",
  "remove member",
  "contract integration",
  "modify voting period",
  "modify quorum threshold",
  "modify supermajority threshold",
  "pause/unpause transfer",
  "extension integration"
];

export const proposalLabel1 = [
  "shares",
  "shares",
  "value",
  "proposed voting period",
  "proposed quorum",
  "proposed supermajority",
  "pause/unpause",
  "extension"
];

export const proposalLabel2 = [
  "account",
  "account",
  "contract",
  null,
  null,
  null,
  null,
  null
];
