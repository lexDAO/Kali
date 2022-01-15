import { useContext, useState } from "react";
import AppContext from "../../context/AppContext";
import { Icon } from "@chakra-ui/react";

const iconSize = 6;
import { viewProposalsHelper } from "../../constants/viewProposalsHelper";

export default function ProposalRow(props) {
  const value = useContext(AppContext);
  const { web3, loading } = value.state;
  const p = props["p"];

  return (
    <div className="proposal-icon">
      <Icon
        as={viewProposalsHelper[p["proposalType"]]["icon"]}
        boxSize={iconSize}
      />
    </div>
  );
}
