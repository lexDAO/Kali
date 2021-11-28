import web3 from "./web3";
const abi = require('../abi/FixedERC20factory.json');

const arbitrum = "0x947B4830Ee29FAEb43C3cE2A3Fea775a9E43831B";
const polygon = "0x29921BeB2d6ef9a73CbaF007Be76A5CCa5D61379";
const rinkeby = "0x87080aA2505ec22965a9f9c5e915D89aDfD625c0";

const factory = new web3.eth.Contract(
  abi,
  rinkeby
);

export default factory;
