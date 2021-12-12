import SendShares from "../components/newproposal/SendShares";
import RemoveMember from "../components/newproposal/RemoveMember";
import SendToken from "../components/newproposal/SendToken";
import ContractCall from "../components/newproposal/ContractCall";

export const proposalHelper = [ // title, description, component
  ["Send Shares", "Learn more", <SendShares />],
  ["Send a Token", "Learn more", <SendToken />],
  ["Call a Contract", "Learn more", <ContractCall />],
  ["Remove Member", "Learn more", <RemoveMember />],
]
