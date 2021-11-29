import web3 from "./web3";
const abi = require('../abi/FixedERC20factory.json');

const arbitrum = "0x2985bDB7eC8f971126B6eBCd9B65662D22a59c6F";
const polygon = "0x5fd571Dca13E1fd2CEff343B574D76A33c8B20C6";
const rinkeby = "0x70EfE1857d508368fa9645345ceAC87f6dDB4229";

const factory = new web3.eth.Contract(
  abi,
  rinkeby
);

export default factory;
