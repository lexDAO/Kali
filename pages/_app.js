import { ChakraProvider } from "@chakra-ui/react";
import AppContext from "../context/AppContext";
import Web3 from "web3";
import { useState, useEffect } from "react";
import theme from "../styles/theme";
const abi = require("../abi/KaliDAO.json");
import { createToast } from "../utils/toast";
import { checkNetwork } from "../utils/checkNetwork";

function MyApp({ Component, pageProps }) {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);
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

  useEffect(() => {
    connectToInfura();

  }, [address]);

  const connectToInfura = async () => {
    let result = await checkNetwork(address);
    console.log("result of infura", result)
    if(result['web3'] != null) {
      setWeb3(result['web3']);
      setChainId(result['chainId']);
    }
  }

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
      //let chainId_ =  await window.ethereum.request({ method: 'eth_chainId' });
      setWeb3(metamask);
      setAccount(accounts[0]);
      //setChainId(parseInt(chainId_));
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
    //let chainId_ =  await window.ethereum.request({ method: 'eth_chainId' });
    //console.log(parseInt(chainId))
    //setChainId(parseInt(chainId_));
  };

  const toast = (props) => {
    createToast(props);
  }

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
          setProposals: setProposals,
          toast: toast
        }}
      >
        <Component {...pageProps} />
      </AppContext.Provider>
    </ChakraProvider>
  );
}

export default MyApp;
