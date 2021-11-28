import web3 from "./web3";
const abi = require('../abi/KaliDAOfactory.json');

const arbitrum = "0xd53B46aE3781904F1f61CF38Fd9d4F47A7e9242B";
const polygon = "0xd40223f63f8D44bE51CDE912aafc30dc340dB438";
const rinkeby = "0xed35f7A980987AeC418C70bb4e01CA4799EC6EFd";

const factory = new web3.eth.Contract(
  abi,
  rinkeby
);

export default factory;
