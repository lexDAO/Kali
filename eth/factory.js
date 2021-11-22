import web3 from "./web3";
const abi = require('../abi/KaliDAOfactory.json');

const factory = new web3.eth.Contract(
  abi,
  "0x144086302f6c8840860117a20d0f81e9d6Ecca87"
);

export default factory;
