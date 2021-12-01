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
        - quoram, votingPeriod struck at initialValue not updating to value filled in NumberInput 
        - voter-share array soon 
        - disable summon when submitting
    */
  }

  const handleFactorySubmit = async (values) => {
    toggleLoading();
    console.log("DAO Form: ", values);

    const {
      docs,
      name,
      quorum,
      shares,
      symbol,
      votePeriodUnit,
      voters,
      votingPeriod,
      supermajority,
      mint,
      call,
      gov,
    } = values;

    // convert shares to wei
    var sharesArray = [];
    for (let i = 0; i < shares.split(",").length; i++) {
      sharesArray.push(web3.utils.toWei(shares.split(",")[i]));
    }

    // convert vote period to appropriate unit
    if (votePeriodUnit == "minutes") {
      votingPeriod *= 60;
    } else if (votePeriodUnit == "hours") {
      votingPeriod *= 60 * 60;
    } else if (votePeriodUnit == "days") {
      votingPeriod *= 60 * 60 * 24;
    } else if (votePeriodUnit == "weeks") {
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

    const accounts = await web3.eth.getAccounts();
    console.log("Account: ", accounts[0]);

    try {
      let result = await factory.methods
        .deployKaliDAO(
          name,
          symbol,
          docs,
          true,
          voters.split(","),
          sharesArray,
          votingPeriod,
          quorum,
          supermajority,
          mint,
          call,
          gov
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
    voters: "",
    shares: "",
    docs: "",
    votePeriodUnit: "",
    votingPeriod: 1,
    quorum: 1,
    supermajority: 60,
    mint: 1,
    call: 1,
    gov: 3,
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Required"),
    symbol: Yup.string().required("Required"),
    voters: Yup.string().required("Required"),
    shares: Yup.string().required("Required"),
    docs: Yup.string().required("Required"),
    votePeriodUnit: Yup.string().required("Required"),
    votingPeriod: Yup.number().required("Required"),
    quorum: Yup.number().required("Required"),
    supermajority: Yup.number().required("Required"),
    mint: Yup.number().required("Required"),
    call: Yup.number().required("Required"),
    gov: Yup.number().required("Required"),
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
              placeholder="0xabc, 0xdef, 0xghi"
            />
            <FormikControl
              control="textarea"
              type="text"
              label="Shares"
              name="shares"
              placeholder="1, 2, 3"
            />
            {/* Add validation for Voting Period and Quoram */}
            <FormikControl
              control="number-input"
              label="Voting Period"
              name="votingPeriod"
              defaultValue={3}
              min={1}
            />
            <FormikControl
              control="select"
              name="votePeriodUnit"
              label="Voting Period Unit"
              options={optionsVotingPeriod}
            />
            <FormikControl
              control="number-input"
              name="quorum"
              defaultValue={10}
              min={0}
              max={100}
              label="Quorum %"
            />
            {/*Hidden Inputs*/}
            <FormikControl
              control="input"
              type="hidden"
              name="supermajority"
              value={60}
            />
            <FormikControl
              control="input"
              type="hidden"
              name="mint"
              value={1}
            />
            <FormikControl
              control="input"
              type="hidden"
              name="call"
              value={1}
            />
            <FormikControl control="input" type="hidden" name="gov" value={3} />
            <br />
            <Button type="submit">Summon</Button>
          </Form>
        )}
      </Formik>
    </FlexGradient>
  );
}

export default FactoryForm;
