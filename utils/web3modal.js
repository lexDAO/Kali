import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3Modal from "web3modal";
import Web3 from 'web3';

let web3m;

if (typeof window !== "undefined") {
  const providerOptions = {
    walletconnect: {
      package: WalletConnectProvider, // required
      options: {
        infuraId: "26e178ea568e492983f2431ad6a31e74" // required
      }
    }
  };
  // We are in the browser and metamask is running.
  const web3Modal = new Web3Modal({
    providerOptions
  });

  const provider = await web3Modal.connect();

  web3m = new Web3(provider);

} else {
  // We are on the server *OR* the user is not running metamask
  const provider = new Web3.providers.HttpProvider(
    "https://rinkeby.infura.io/v3/26e178ea568e492983f2431ad6a31e74"
  );
  web3m = new Web3(provider);
}

export default web3m;
