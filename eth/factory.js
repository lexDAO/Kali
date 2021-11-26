import web3 from "./web3";
const abi = require('../abi/KaliDAOfactory.json');

const polygon = "0x33c8268e4A0ED135DDAc52Ea4CCE67F10e9605Cb";
const rinkeby = "0x411a1EBd260eB0E4cB534Cb3f4974B7952ebD4e9";

const factory = new web3.eth.Contract(
  abi,
  rinkeby
);

// polygon: 0x33c8268e4A0ED135DDAc52Ea4CCE67F10e9605Cb

export default factory;
