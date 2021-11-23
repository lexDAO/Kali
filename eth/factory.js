import web3 from "./web3";
const abi = require('../abi/KaliDAOfactory.json');

const factory = new web3.eth.Contract(
  abi,
  "0xBfe01d81A64e6537a53D3825699A719f6b9C01b8"
);

export default factory;
