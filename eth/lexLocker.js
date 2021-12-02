import web3 from "./web3";
const abi = require('../abi/LexLocker.json');

const arbitrum = "0xc0d255983316d72e2CCa3bCd601a0d2D9b96D0F3";
const polygon = "0x8D9779bFe26CC35eacF677b51e10BfFe9567EFc5";
const rinkeby = "0x5F0d15EF165D670F82510bb56a28B4bA48cf08Fc";

const lexLocker = new web3.eth.Contract(
  abi,
  rinkeby
);

export default lexLocker;
