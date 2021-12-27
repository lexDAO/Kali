import Web3 from "web3";
import { supportedChains } from "../constants/supportedChains";

export async function correctNetwork(address) {
  var correctChain = null;
  var correctWeb3 = null;

  if(address != null) {
    for (var i = 0; i < supportedChains.length; i++) {
      let provider = new Web3.providers.HttpProvider(
        "https://" +
          supportedChains[i]["infura"] +
          "/v3/26e178ea568e492983f2431ad6a31e74"
      );
      let web3 = new Web3(provider);
      let chainId = await web3.eth.getChainId();
      let code = await web3.eth.getCode(address);

      if (code != "0x") {
        correctChain = chainId;
        correctWeb3 = web3;
      }
    }
  }
  return { web3: correctWeb3, chainId: correctChain };
}
