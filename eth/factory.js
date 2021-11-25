import web3 from "./web3";
const abi = require('../abi/KaliDAOfactory.json');

const factory = new web3.eth.Contract(
  abi,
  "0xA928fA94db8F8E0B243EFE6DB947C7394888B0d0"
);

export default factory;
