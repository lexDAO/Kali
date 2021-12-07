import { ChakraProvider } from "@chakra-ui/react";
import AppContext from '../context/AppContext';

//import Web3 from 'web3';
import Web3 from 'web3';
import { useState, useEffect } from 'react';
import theme from '../styles/theme';
import web3m from '../utils/web3modal';

//import infura from '../utils/infura';

function MyApp({ Component, pageProps }) {

  const [web3, setWeb3] = useState(web3m);
  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {

    ethereum.on("accountsChanged", function (accounts) {
      changeAccount();
    });

    ethereum.on("chainChanged", () => {
      changeChain();
    });

    ethereum.on("connect", () => {
    });

    ethereum.on("disconnect", () => {
      console.log("disconnected");

      setWeb3(infura);
      setAccount(null);
      setChainId(null);

    });
  }, []);

  const connect = async () => {

    if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
      // We are in the browser and metamask is running.
      window.ethereum.request({ method: "eth_requestAccounts" });
      let web3module = new Web3(window.ethereum);
      let accounts = await web3module.eth.getAccounts();
      let chain = await web3module.eth.getChainId();
      setWeb3(web3module);
      setAccount(accounts[0]);
      setChainId(chain);

    } else {
      // We are on the server *OR* the user is not running metamask
      alert("please connect Metamask")
    }
  }

  const changeAccount = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });

        if (accounts.length !== 0) {
          setAccount(ethereum.selectedAddress);
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
            loading: loading
          },
          setWeb3: setWeb3,
          setAccount: setAccount,
          setChainId: setChainId,
          setLoading: setLoading,
          connect: connect
        }}
      >
        <Component {...pageProps} />
      </AppContext.Provider>
    </ChakraProvider>
  );
}

export default MyApp;
