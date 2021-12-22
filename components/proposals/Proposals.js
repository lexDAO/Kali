import { useState, useContext, useEffect } from "react";
import Router, { useRouter } from "next/router";
import AppContext from "../../context/AppContext";
//import ProposalDetails from './ProposalDetails';
import { chakra, Center, Text, Grid, Button } from "@chakra-ui/react";
import Layout from "../structure/Layout";
import ProposalRow from "./ProposalRow";
import { proposalTypes, voteTypes } from "../../constants/params";
import { fetchProposals } from "../../utils/fetchProposals";

export default function Proposals(props) {
  const value = useContext(AppContext);
  const { web3, loading, proposals, address, dao, reload } = value.state;
  const [toggle, setToggle] = useState("active");

  useEffect(() => {
    if (dao == null) {
      return;
    } else {
      fetchData();
    }
  }, []);

  useEffect(() => {
    if (dao == null) {
      return;
    } else {
      fetchData();
    }
  }, [reload]);

  async function fetchData() {
    let abi = require("../../abi/KaliDAO.json");
    let instance = new web3.eth.Contract(abi, address);
    let proposals_ = await fetchProposals(instance, address, web3, dao);
    value.setProposals(proposals_);
    console.log(proposals_);
  }

  const handleClick = () => {
    if (toggle == "active") {
      setToggle("pending");
    } else {
      setToggle("active");
    }
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
      <Button onClick={handleClick}>
        {toggle == 'active' ? "Show Unsponsored" : "Show Active"}
      </Button>
      {proposals != null ? (
        <ProposalContainer proposals={proposals[toggle]} />
      ) : null}
    </>
  );
}
