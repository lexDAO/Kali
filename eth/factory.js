import { useContext } from 'react';
import AppContext from '../context/AppContext';
const abi = require('../abi/KaliDAOfactory.json');

const arbitrum = "0xd53B46aE3781904F1f61CF38Fd9d4F47A7e9242B";
const polygon = "0x582eAF6a83E55d60615A5FfB80913bE5c1724c41";
const rinkeby = "0x6106375F8549fD1a688956F7070aa8bA3fdF51b2";

export default function makeFactory() {
  const value = useContext(AppContext);
  const { web3 } = value.state;
  const instance = new web3.eth.Contract(
    abi,
    rinkeby
  );
  return instance;
}
