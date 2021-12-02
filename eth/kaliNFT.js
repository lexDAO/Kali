import web3 from "./web3";
const abi = require('../abi/KaliNFT.json');

const arbitrum = "0x5F43Ff59ee5aE5a98cF59764C094e9aba830ecEE";
const polygon = "0x1401B932839421B5db90cCd07417Bc4583e98729";
const rinkeby = "0xA503f9F9350C5A6C5a550fa0FCA9fCE1dd5ab7c6";

const kaliNFT = new web3.eth.Contract(
  abi,
  rinkeby
);

export default kaliNFT;
