import web3 from "./web3";
const abi = require('../abi/FixedERC20factory.json');

const arbitrum = "0x0D6aDcBb5b8426931ca0Ce8E41eBaE4D87CE354E";
const polygon = "0x185009425978954512C23FCD94e090A5b6847eeE";
const rinkeby = "0x0D6aDcBb5b8426931ca0Ce8E41eBaE4D87CE354E";

const factory = new web3.eth.Contract(
  abi,
  rinkeby
);

export default factory;
