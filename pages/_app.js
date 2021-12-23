import { ChakraProvider } from "@chakra-ui/react";
import AppContext from "../context/AppContext";
import infura from "../utils/infura";
import Web3 from "web3";
import { useState, useEffect } from "react";
import theme from "../styles/theme";
const abi = require("../abi/KaliDAO.json");

function MyApp({ Component, pageProps }) {
  const [web3, setWeb3] = useState(infura[0]);
  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(infura[1]);
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [visibleView, setVisibleView] = useState(1);
  const [dao, setDao] = useState(null);
  const [proposals, setProposals] = useState(null);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      typeof window.ethereum !== "undefined"
    ) {
      ethereum.on("accountsChanged", function (accounts) {
        changeAccount();
      });

      ethereum.on("chainChanged", () => {
        changeChain();
      });

      ethereum.on("connect", () => {});

      ethereum.on("disconnect", () => {
        console.log("disconnected");
      });
    }
  }, []);

  const connect = async () => {
    console.log("connect");
    if (
      typeof window !== "undefined" &&
      typeof window.ethereum !== "undefined"
    ) {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      let metamask = new Web3(window.ethereum);
      setWeb3(metamask);
      setAccount(accounts[0]);
    } else {
      alert("please connect to wallet");
    }
  };

  const changeAccount = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });

        if (accounts.length !== 0) {
          setAccount(ethereum.selectedAddress);
          connect();
        } else {
          console.log("No authorised account found");
          return;
        }
      } catch (error) {
        if (error.code === 4001) {
          console.log("Metamask Connection Cancelled");
        }
      }
    } else {
      console.log("Make sure you have MetaMask!");
    }
  };

  const changeChain = async () => {
    window.location.reload();
  };

  return (
    <ChakraProvider theme={theme}>
      <AppContext.Provider
        value={{
          state: {
            web3: web3,
            account: account,
            chainId: chainId,
            loading: loading,
            address: address,
            abi: abi,
            visibleView: visibleView,
            dao: dao,
            proposals: proposals,
          },
          setWeb3: setWeb3,
          setAccount: setAccount,
          setChainId: setChainId,
          setLoading: setLoading,
          setAddress: setAddress,
          connect: connect,
          setVisibleView: setVisibleView,
          setDao: setDao,
          setProposals: setProposals
        }}
      >
        <Component {...pageProps} />
      </AppContext.Provider>
    </ChakraProvider>
  );
}

export default MyApp;
