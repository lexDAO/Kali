const abi = require("../abi/KaliDAOtribute.json");

export function tributeInstance(address, web3) {
  let tributeInstance = new web3.eth.Contract(abi, address);
  return tributeInstance;
}
