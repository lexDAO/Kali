import web3 from "./web3";
const abi = require('../abi/KaliDAOfactory.json');

const arbitrum = "0xd53B46aE3781904F1f61CF38Fd9d4F47A7e9242B";
const polygon = "0x582eAF6a83E55d60615A5FfB80913bE5c1724c41";
const rinkeby = "0xD2C17f25851D3B1b5E245b6a4484a84607Cb80B4";

const factory = new web3.eth.Contract(
  abi,
  rinkeby
);

export default factory;
