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
import { factory_rinkeby } from '../../utils/addresses';
import { factoryInstance } from '../../eth/factory';

export default function Dao() {
  const value = useContext(AppContext);
  const { web3, loading, abi, reload, visibleView, dao, proposals, balances, holdersArray } = value.state;

  // * get DAO address from route * //
  const router = useRouter();
  const address = router.query.dao;
  // only fetch dao info once address from query has resolved
  useEffect(() => {
    fetchData();
  }, [address]);

  useEffect(() => {
    fetchData();
  }, [reload]);

  async function fetchData() {
    if(!address) {
      return;
    } else {
      value.setLoading(true);
      value.setAddress(address);
      const instance = new web3.eth.Contract(abi, address);
      const factory = factoryInstance(factory_rinkeby, web3);
      const {dao_, holdersArray_, proposalVoteTypes_, proposals_, balances_} = await fetchAll(instance, factory, address, web3);
      value.setDao(dao_);
      value.setHoldersArray(holdersArray_);
      value.setProposalVoteTypes(proposalVoteTypes_);
      value.setProposals(proposals_);
      value.setBalances(balances_);
      console.log(balances_)
      value.setLoading(false);
    }
  }

  return(
    <Layout>
    {address!=null ?
    <>
    <ActionMenu />
      {visibleView==1 ? <Proposals />
        : visibleView==2 ? <NewProposal />
        : visibleView==3 ? <DaoInfo />
        : null }
    </>
    : 'Loading...'}
    </Layout>
  )
}
