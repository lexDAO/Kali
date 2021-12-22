import { useContext, useState } from "react";
import AppContext from "../../context/AppContext";
import ProposalDetails from "./ProposalDetails";
import { chakra, Input, Text, Textarea, Divider } from "@chakra-ui/react";
import { viewProposalsHelper } from "../../constants/viewProposalsHelper";

const ProposalLabel = (props) => {
  return (
    <Text casing="uppercase">
      <b>{props.children}</b>
    </Text>
  );
};

const ProposalInput = (props) => {
  return <Input value={props.value} disabled />;
};

const ProposalDivider = (props) => {
  return <Divider mb={5} />;
};

export default function ProposalModal(props) {
  const value = useContext(AppContext);
  const { web3, loading } = value.state;
  const p = props["p"];
  const type = p["proposalType"];

  return (
    <>
      <Text casing="uppercase">Submitted by {p["proposer"]}</Text>
      <ProposalDivider />

      <ProposalLabel>description</ProposalLabel>
      <Text>{p["description"]}</Text>
      <ProposalDivider />

      {p["amounts"].map((item, index) => (
        <>
          {viewProposalsHelper[type]["details"]["amounts"] == null ? null : (
            <>
              <ProposalLabel>
                {viewProposalsHelper[type]["details"]["amounts"]}
              </ProposalLabel>
              <Text>{p["amounts"][index]}</Text>
              <ProposalDivider />
            </>
          )}

          {viewProposalsHelper[type]["details"]["accounts"] == null ? null : (
            <>
              <ProposalLabel>
                {viewProposalsHelper[type]["details"]["accounts"]}
              </ProposalLabel>
              <Text>{p["accounts"][index]}</Text>
              <ProposalDivider />
            </>
          )}
          {viewProposalsHelper[type]["details"]["payloads"] == null ? null : (
            <>
              <ProposalLabel>payload</ProposalLabel>
              <Text>{p["payloads"][index]}</Text>
              <Text>Decoded: </Text>
              <ProposalDivider />
            </>
          )}
        </>
      ))}
    </>
  );
}
