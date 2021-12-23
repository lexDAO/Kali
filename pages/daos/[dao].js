import { useState, useContext, useEffect } from "react";
import { useRouter } from "next/router";
import AppContext from "../../context/AppContext";
import Layout from "../../components/structure/Layout";
import Proposals from "../../components/proposals/Proposals";
import NewProposal from "../../components/newproposal/NewProposal";
import DaoInfo from "../../components/daoinfo/DaoInfo";
import ActionMenu from "../../components/structure/ActionMenu";

export default function Dao() {
  const value = useContext(AppContext);
  const { visibleView } = value.state;
  // * get DAO address from route * //
  const router = useRouter();
  const address = router.query.dao;
  useEffect(() => {
    if(!address) {
      return;
    } else {
      value.setAddress(address);
    }
  }, [address]);

  return (

    <Layout>

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
      
    </Layout>
  );
}
