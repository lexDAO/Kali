const abi = require("../abi/KaliDAO.json");

export function daoInstance(address, web3) {
  let instance = new web3.eth.Contract(abi, address);
  return instance;
}
