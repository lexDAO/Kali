import { useState, useContext, useEffect } from "react";
import { useRouter } from "next/router";
import AppContext from "../../context/AppContext";
// components
import Layout from "../../components/structure/Layout";
import Proposals from "../../components/proposals/Proposals";
import NewProposal from "../../components/newproposal/NewProposal";
import DaoInfo from "../../components/daoinfo/DaoInfo";
import ActionMenu from "../../components/structure/ActionMenu";
// functions
import { fetchDaoInfo } from "../../utils/fetchDaoInfo";
import { addresses } from "../../constants/addresses";
import { factoryInstance } from "../../eth/factory";

const proposalTypes = require("../../constants/params");

export default function Dao() {
  const value = useContext(AppContext);
  const { web3, loading, account, abi, chainId, reload, visibleView, dao } =
    value.state;

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
    if (!address) {
      return;
    } else {
      value.setAddress(address);

      const instance = new web3.eth.Contract(abi, address);

      const factory = factoryInstance(addresses[chainId]["factory"], web3);

      const { dao_ } = await fetchDaoInfo(
        instance,
        factory,
        address,
        web3,
        chainId,
        account
      );

      value.setDao(dao_);
      console.log(dao_);
      value.setLoading(false);
    }
  }

  return (
    <Layout>
      {address != null ? (
        <>
          <ActionMenu />
          {visibleView == 1 ? (
            <DaoInfo />
          ) : visibleView == 2 ? (
            <Proposals />
          ) : visibleView == 3 ? (
            <NewProposal />
          ) : null}
        </>
      ) : (
        "Loading..."
      )}
    </Layout>
  );
}
