import Web3 from 'web3';

let infura;

const provider = new Web3.providers.HttpProvider(
  "https://rinkeby.infura.io/v3/f0d8e56e0aeb4a8594192dc550f05a2d"
);
infura = new Web3(provider);

export default infura;

// ejt test: f0d8e56e0aeb4a8594192dc550f05a2d
// lexdao: 26e178ea568e492983f2431ad6a31e74
