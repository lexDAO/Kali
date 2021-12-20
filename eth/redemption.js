const abi = require("../abi/KaliDAOredemption.json");

export function redemptionInstance(address, web3) {
  let redemptionInstance = new web3.eth.Contract(abi, address);
  return redemptionInstance;
}
