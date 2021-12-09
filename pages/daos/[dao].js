import { useState, useContext, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useRouter } from "next/router";
import AppContext from '../../context/AppContext';
import {
  Text
} from "@chakra-ui/react";
import Layout from '../../components/structure/Layout';
import Proposals from "../../components/proposals/Proposals"
import NewProposal from "../../components/newproposal/NewProposal"
import DaoInfo from "../../components/daoinfo/DaoInfo"
import ActionMenu from "../../components/structure/ActionMenu"

const proposalTypes = require("../../utils/appParams");
import { fetchAll } from '../../utils/getterFunctions';

export default function Dao() {
  const value = useContext(AppContext);
  const { web3, loading, abi, reload } = value.state;
  const [visible, setVisible] = useState(1);
  const [dao, setDao] = useState({});
  const [holdersArray, setHoldersArray] = useState([]);
  const [proposalVoteTypes, setProposalVoteTypes] = useState([]);
  const [proposals, setProposals] = useState(null);
  // * get DAO address from route * //
  const router = useRouter();
  const address = router.query.dao;

  // only fetch dao info once address from query has resolved
  useEffect(() => {
    fetchData();
  }, [address]);

  useEffect(() => {
    fetchData();
    setVisible(1);
  }, [reload]);

  async function fetchData() {
    if(!address) {
      return;
    } else {
      value.setLoading(true);
      value.setAddress(address);
      const instance = new web3.eth.Contract(abi, address);
      const {dao_, holdersArray_, proposalVoteTypes_, proposals_} = await fetchAll(instance);
      setDao(dao_);
      setHoldersArray(holdersArray_);
      setProposalVoteTypes(proposalVoteTypes_);
      setProposals(proposals_);
      value.setLoading(false);
    }
  }

  return(
    <Layout>
    {address!=null ?
    <>
    <ActionMenu setVisible={setVisible} />
      {visible==1 ? <Proposals proposals={proposals} address={address} />
        : visible==2 ? <NewProposal />
        : visible==3 ? <DaoInfo dao={dao} address={address} holdersArray={holdersArray} />
        : null }
    </>
    : 'Loading...'}
    </Layout>
  )
}
