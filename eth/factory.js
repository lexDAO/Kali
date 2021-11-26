import web3 from "./web3";
const abi = require('../abi/KaliDAOfactory.json');

const polygon = "0xA928fA94db8F8E0B243EFE6DB947C7394888B0d0";
const rinkeby = "0x8B9Dab401aa3cA5A81c2a8Ce65604c91cEcD2eA8";

const factory = new web3.eth.Contract(
  abi,
  rinkeby
);

// polygon: 0xA928fA94db8F8E0B243EFE6DB947C7394888B0d0

export default factory;
