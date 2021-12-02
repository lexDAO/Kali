import Web3 from "web3";

let web3;

const polygon = "https://polygon-mainnet.infura.io/v3/5cd9940fc0384b239756dd70eeefb1fb";
const rinkeby = "https://rinkeby.infura.io/v3/26e178ea568e492983f2431ad6a31e74";

if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
  // We are in the browser and metamask is running.
  window.ethereum.request({ method: "eth_requestAccounts" });
  web3 = new Web3(window.ethereum);
} else {
  // We are on the server *OR* the user is not running metamask
  const provider = new Web3.providers.HttpProvider(
    rinkeby
  );
  web3 = new Web3(provider);
}

export default web3;
