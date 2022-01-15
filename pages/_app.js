import { ChakraProvider } from "@chakra-ui/react";
import AppContext from "../context/AppContext";
import Web3 from "web3";
import { useState, useEffect } from "react";
import theme from "../styles/theme";
const abi = require("../abi/KaliDAO.json");
import { createToast } from "../utils/toast";
import { correctNetwork } from "../utils/network";
import { getNetworkName } from "../utils/formatters";
import { supportedChains } from "../constants/supportedChains";
import "../styles/style.css";

function MyApp({ Component, pageProps }) {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [daoChain, setDaoChain] = useState(null);
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

  useEffect(() => {
    if(chainId != null) {
      isCorrectChain();
    }
  }, [chainId]);

  const connectToInfura = async () => {
    let result = await correctNetwork(address);
    setWeb3(result['web3']);
    setDaoChain(result['chainId']);
    setChainId(result['chainId']);
    setAccount(null);
  }

  const connect = async () => {
    try {
      if (
        typeof window !== "undefined" &&
        typeof window.ethereum !== "undefined"
      ) {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        let metamask = new Web3(window.ethereum);
        let chainId_ =  await window.ethereum.request({ method: 'eth_chainId' });
        setWeb3(metamask);
        setAccount(accounts[0]);
        setChainId(parseInt(chainId_));
      }
    } catch(e) {
      toast(e)
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
    console.log("change chain")
    let chainId_ =  await window.ethereum.request({ method: 'eth_chainId' });
    setChainId(parseInt(chainId_));
  };

  const isCorrectChain = async () => {
    if(address != null) {
      if(chainId != daoChain) {
        let name = getNetworkName(daoChain);
        toast("Please connect to the " + name + " network.");
      }
    } else {
      var supported = false;
      for(var i=0; i < supportedChains.length; i++) {
        if(supportedChains[i]["chainId"]==chainId) {
          supported = true;
        }
      }
      if(supported == false) {
        toast("This network is not currently supported.")
      }
    }
  }

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
            daoChain: daoChain,
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
          setDaoChain: setDaoChain,
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
