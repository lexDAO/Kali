import React, { useState } from "react";
import factory from "../eth/factory.js";
import web3 from "../eth/web3.js";
import Router from "next/router";
import { Button } from "@chakra-ui/react";
import FlexGradient from "./FlexGradient";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import FormikControl from "./form/FormikControl.js";
import { Input } from "@chakra-ui/react";

function FactoryForm(props) {
  const { toggleLoading } = props;
  const [account, setAccount] = useState(null);

  {
    /* ISSUES
        - voter-share array soon 
        - add support for custom gov setting 
    */
  }

  const handleFactorySubmit = async (values) => {
    toggleLoading();
    console.log("DAO Form: ", values);

    const govSettings = "0,60,0,0,0,0,0,0,0,0,0,0";
    const extensions = new Array(0);
    const extensionsData = new Array(0);

    const {
      name,
      symbol,
      docs,
      voters,
      shares,
      votingPeriod,
      votingPeriodUnit,
    } = values;

    // convert shares to wei
    let sharesArray = [];
    for (let i = 0; i < shares.split(",").length; i++) {
      sharesArray.push(web3.utils.toWei(shares.split(",")[i]));
    }

    // convert voting period to appropriate unit
    if (votingPeriodUnit == "minutes") {
      votingPeriod *= 60;
    } else if (votingPeriodUnit == "hours") {
      votingPeriod *= 60 * 60;
    } else if (votingPeriodUnit == "days") {
      votingPeriod *= 60 * 60 * 24;
    } else if (votingPeriodUnit == "weeks") {
      votingPeriod *= 60 * 60 * 24 * 7;
    }

    // convert docs to appropriate links
    if (docs == "COC") {
      docs =
        "https://github.com/lexDAO/LexCorpus/blob/master/contracts/legal/dao/membership/CodeOfConduct.md";
    } else if (docs == "UNA") {
      docs =
        "https://github.com/lexDAO/LexCorpus/blob/master/contracts/legal/dao/membership/TUNAA.md";
    } else if (docs == "LLC") {
      docs =
        "https://github.com/lexDAO/LexCorpus/blob/master/contracts/legal/dao/membership/operating/DelawareOperatingAgreement.md";
    }

    console.log("votingPeriod:", votingPeriod);

    let votersArray = voters.split(",");
    let _voters = "";

    for (let i = 0; i < votersArray.length; i++) {
      if (votersArray[i].includes(".eth")) {
        votersArray[i] = await web3.eth.ens
          .getAddress(votersArray[i])
          .catch(() => {
            alert("ENS not found");
          });
      }

      if (i == votersArray.length - 1) {
        _voters += votersArray[i];
      } else {
        _voters += votersArray[i] + ",";
      }

      voters = _voters;
      console.log("Voters:", voters);
    }

    const accounts = await web3.eth.getAccounts();
    console.log("Account: ", accounts[0]);

    try {
      let result = await factory.methods
        .deployKaliDAO(
          name,
          symbol,
          docs,
          true,
          extensions,
          extensionsData,
          voters.split(","),
          sharesArray,
          votingPeriod,
          govSettings.split(",")
        )
        .send({ from: accounts[0] });

      let dao = result["events"]["DAOdeployed"]["returnValues"]["kaliDAO"];

      Router.push({
        pathname: "/daos/[dao]",
        query: { dao: dao },
      });
    } catch (e) {
      alert(e);
      console.log(e);
    }

    toggleLoading();
  };

  const initialValues = {
    name: "",
    symbol: "",
    docs: "",
    voters: "",
    shares: "",
    votingPeriodUnit: "",
    votingPeriod: 1,
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Required"),
    symbol: Yup.string().required("Required"),
    voters: Yup.string().required("Required"),
    shares: Yup.string().required("Required"),
    docs: Yup.string().required("Required"),
    votingPeriodUnit: Yup.string().required("Required"),
    votingPeriod: Yup.number().required("Required"),
  });

  const optionsDocs = [
    { key: "Select Document", value: "" },
    { key: "Code of Conduct", value: "COC" },
    { key: "UNA", value: "UNA" },
    { key: "LLC", value: "LLC" },
  ];

  const optionsVotingPeriod = [
    { key: "Select Voting Period", value: "" },
    { key: "Minutes", value: "minutes" },
    { key: "Hours", value: "hours" },
    { key: "Days", value: "days" },
  ];

  return (
    <FlexGradient>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleFactorySubmit}
      >
        {() => (
          <Form>
            <FormikControl
              control="input"
              type="text"
              label="Name"
              name="name"
              placeholder="KaliDAO"
            />
            <FormikControl
              control="input"
              type="text"
              label="Symbol"
              name="symbol"
              placeholder="KALI"
            />
            <FormikControl
              control="select"
              label="Document"
              name="docs"
              options={optionsDocs}
            />
            <FormikControl
              control="textarea"
              type="text"
              label="Founders"
              name="voters"
              placeholder="Enter ETH address or ENS and separate them by a comma like this - 'aaa.eth,bbb.eth'"
            />
            <FormikControl
              control="textarea"
              type="text"
              label="Shares"
              name="shares"
              placeholder="1,2,3"
            />
            <FormikControl
              control="number-input"
              label="Voting Period"
              name="votingPeriod"
              defaultValue={3}
              min={1}
            />
            <FormikControl
              control="select"
              name="votingPeriodUnit"
              label="Voting Period Unit"
              options={optionsVotingPeriod}
            />
            <br />
            <Button type="submit">Summon</Button>
          </Form>
        )}
      </Formik>
    </FlexGradient>
  );
}

export default FactoryForm;
