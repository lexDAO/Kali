import SendShares from "../components/newproposal/SendShares";
import RemoveMember from "../components/newproposal/RemoveMember";
import SendToken from "../components/newproposal/SendToken";
import ContractCall from "../components/newproposal/ContractCall";

export const proposalHelper = [ // title, description, component
  ["Send Shares", "Add a new member, or send more shares to an existing member.", <SendShares />],
  ["Send a Token", "Send an ERC20 token from the DAO treasury to an ETH wallet or another smart contract.", <SendToken />],
  ["Call a Contract", "Integrate with another smart contract.", <ContractCall />],
  ["Remove Member", "Propose removal of member due to misconduct or wallet hack.", <RemoveMember />],
]
