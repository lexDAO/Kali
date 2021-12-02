import web3 from "./web3";
const abi = require('../abi/FixedERC20factory.json');

const arbitrum = "0xF85e8B97c058cb13DB8651217f69AD7D7efFf877";
const polygon = "0xafB6aC447f765a6BFD6B0D08D03a509D028BD11a";
const rinkeby = "0x6aBab95BB30710159B3e40bF6e049f935547D12b";

const fixedERC20factory = new web3.eth.Contract(
  abi,
  rinkeby
);

export default fixedERC20factory;
