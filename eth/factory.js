import web3 from "./web3";
const abi = require('../abi/KaliDAOfactory.json');

const polygon = "0x3F02b702b2CEF418dfa7Cc9AB67086263bf0A457";
const rinkeby = "0xBc87B1A40796070d29e7aC8d08fB61D2A7685A27";

const factory = new web3.eth.Contract(
  abi,
  rinkeby
);

export default factory;
