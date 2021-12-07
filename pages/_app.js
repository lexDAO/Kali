import { ChakraProvider } from "@chakra-ui/react";
import AppContext from '../context/AppContext';
import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3Modal from "web3modal";
import Web3 from 'web3';
import { useState, useEffect } from 'react';
//import web3m from '../utils/web3modal';
import web3Infura from '../utils/infura';
import theme from '../styles/theme';

function MyApp({ Component, pageProps }) {

  const [web3, setWeb3] = useState(web3Infura);
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
      setWeb3(null)
      setAccount(null)
      setChainId(null)
    });
  }, []);

  const connect = async() => {
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

    setWeb3(new Web3(provider));
    console.log("pressed")
    let accounts = await web3.eth.getAccounts();
    setAccount(accounts[0]);
    setChainId(await web3.eth.getChainId());
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
