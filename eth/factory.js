import web3 from "./web3";
const abi = require('../abi/KaliDAOfactory.json');

const polygon = "0x3F02b702b2CEF418dfa7Cc9AB67086263bf0A457";
const rinkeby = "0x7c5B08e18FD1864b44b23372820680a45BB7Ff3A";

const factory = new web3.eth.Contract(
  abi,
  rinkeby
);

export default factory;
