import web3 from "./web3";
const abi = require('../abi/KaliDAOfactory.json');

const polygon = "0x3F02b702b2CEF418dfa7Cc9AB67086263bf0A457";
const rinkeby = "0xD219594C6913705c3e8B2A7b3442729f29b16E2b";

const factory = new web3.eth.Contract(
  abi,
  rinkeby
);

export default factory;
