import { addresses } from "../constants/addresses";

export async function fetchDaoNames(factory) {
  const events = await factory.getPastEvents("DAOdeployed", {
    fromBlock: 0,
    toBlock: "latest",
  });
  const names = [];
  for(let i=0; i < events.length; i++) {
    names.push(events[i]["returnValues"]["name"]);
  }
  return names;
}
