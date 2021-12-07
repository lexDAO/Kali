import Web3 from 'web3';

let web3Infura;

const provider = new Web3.providers.HttpProvider(
  "https://rinkeby.infura.io/v3/26e178ea568e492983f2431ad6a31e74"
);
web3Infura = new Web3(provider);


export default web3Infura;
