import { useState, useContext, useEffect } from "react";
import Router, { useRouter } from "next/router";
import AppContext from "../../context/AppContext";
//import ProposalDetails from './ProposalDetails';
import { chakra, Center, Text, Grid, Button } from "@chakra-ui/react";
import Layout from "../structure/Layout";
import ProposalRow from "./ProposalRow";
import Reload from "../elements/Reload";
import ToggleProposals from "./ToggleProposals";
import { proposalTypes, voteTypes } from "../../constants/params";
import { fetchProposals } from "../../utils/fetchProposals";

export default function Proposals(props) {
  const value = useContext(AppContext);
  const { web3, loading, proposals, address, dao, chainId, daoChain } = value.state;
  const [toggle, setToggle] = useState("active");

  useEffect(() => { // dao object must be set before loading proposals
    if (dao == null) {
      return;
    } else{
      if(proposals == null) {
        fetchData();
      }
    }
  }, [dao]);

  async function fetchData() {
    value.setLoading(true);
    try {
      let abi = require("../../abi/KaliDAO.json");
      let instance = new web3.eth.Contract(abi, address);
      let proposals_ = await fetchProposals(instance, address, web3, daoChain, dao);
      value.setProposals(proposals_);
      console.log(proposals_);
      value.setLoading(false);
    } catch(e) {
      value.toast(e);
      value.setLoading(false);
    }
  }

  const reloadProposals = async() => {
    fetchData();
  }

  const handleClick = (value) => {
    setToggle(value);
  };

  const ProposalContainer = (props) => {
    return (
      <>
        {props["proposals"].length == 0 ? (
          "Awaiting Proposals"
        ) : (
          <Grid
            templateColumns={{
              sm: "repeat(1, 1fr)",
              md: "repeat(2, 1fr)",
              lg: "repeat(3, 1fr)",
            }}
          >
            {props["proposals"].map((p, index) => (
              <ProposalRow key={index} p={p} i={index} />
            ))}
          </Grid>
        )}
      </>
    );
  };

  return (
    <>
      <ToggleProposals handleClick={handleClick} toggle={toggle} />
      <Reload reload={reloadProposals} />
      {proposals != null ? (
        <ProposalContainer proposals={proposals[toggle]} />
      ) : null}
    </>
  );
}
