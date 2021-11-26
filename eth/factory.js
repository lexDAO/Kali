import web3 from "./web3";
const abi = require('../abi/KaliDAOfactory.json');

const polygon = "0x112f6748817CD5A479382dFEbaADB493a1dd6c6f";
const rinkeby = "0xa81a3Bc02C3BE846B93d2cdFF514837eFB4eF666";

const factory = new web3.eth.Contract(
  abi,
  rinkeby
);

// polygon: 0x112f6748817CD5A479382dFEbaADB493a1dd6c6f

export default factory;
