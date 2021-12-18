const abi = require("../abi/KaliNFT.json");

export default function kaliNFT(address, web3) {
  let kaliNFT = new web3.eth.Contract(abi, address);
  return kaliNFT;
}
