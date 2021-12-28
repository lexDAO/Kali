import { useContext, useState } from "react";
import AppContext from "../../context/AppContext";
import ProposalDetails from "./ProposalDetails";
import { chakra, Input, Text, Textarea, Divider } from "@chakra-ui/react";
import { viewProposalsHelper } from "../../constants/viewProposalsHelper";
import { decodeBytes, formatAmounts } from "../../utils/formatters";

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
  const details = viewProposalsHelper[type]["details"];
  var decoded = null;
  if(type==2 || type==8) {
    decoded = decodeBytes(p["payloads"], type, p, web3);
  }
  const amountsFormatted = formatAmounts(p["amounts"], type);

  return (
    <>
      <Text casing="uppercase">Submitted by {p["proposer"]}</Text>
      <ProposalDivider />

      <ProposalLabel>description</ProposalLabel>
      <Text>{p["description"]}</Text>
      <ProposalDivider />

      {p["amounts"].map((item, index) => (
        <div key={`item-${index}`}>
          {details["amounts"] == null ? null : (
            <div key={`amounts-${index}`}>
              <ProposalLabel>
                {details["amounts"]}
              </ProposalLabel>
              <Text>{amountsFormatted[index]}</Text>
              <ProposalDivider />
            </div>
          )}

          {details["accounts"] == null ? null : (
            <div key={`accounts-${index}`}>
              <ProposalLabel>
                {details["accounts"]}
              </ProposalLabel>
              <Text>{p["accounts"][index]}</Text>
              <ProposalDivider />
            </div>
          )}
          {decoded != null ?
            <div key={`decoded-${index}`}>
            <ProposalLabel>Details:</ProposalLabel>
            <ul>
              {decoded[index].map((item, index) => (
                <li key={`decoded-${index}`}>{item}</li>
              ))}
            </ul>
            <ProposalDivider />
          </div>
          : null}
          {details["payloads"] == null ? null : (
            p["payloads"][index] != "0x" ? // don't display dummy data
            <div key={`payloads-${index}`}>
              <ProposalLabel>payload</ProposalLabel>
              <Text>{p["payloads"][index]}</Text>
              <ProposalDivider />
            </div>
            : null
          )}
        </div>
      ))}
    </>
  );
}
