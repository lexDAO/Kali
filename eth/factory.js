import web3 from "./web3";
const abi = require('../abi/KaliDAOfactory.json');

const factory = new web3.eth.Contract(
  abi,
  "0x0D49bc598856cfE3eaA99403D1720E203fa466d8"
);

export default factory;
