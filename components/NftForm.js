import React, { useState } from "react";
import kaliNFT from "../eth/kaliNFT.js"
import web3 from "../eth/web3.js";
import Router from "next/router";
import { Button } from "@chakra-ui/react";
import FlexGradient from "./FlexGradient";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import FormikControl from "./form/FormikControl.js";
import { Input } from "@chakra-ui/react";

function NftForm(props) {
  const { toggleLoading, dao } = props;
  const [account, setAccount] = useState(null);

console.log("DAO Address: ", dao)

  const handleNftSubmit = async (values) => {
    toggleLoading();
    console.log("NFT creation Form: ", values);
    console.log("DAO Address: ", dao);

    const {
      title,
      desc,
      image
    } = values;

    const accounts = await web3.eth.getAccounts();
    const tokenId = await kaliNFT.methods.totalSupply().call();
    const metadata = {
      "title": title, 
      "description": desc, 
      "image": image, 
    }

    console.log("Account: ", accounts[0]);
    console.log("KaliNFT tokenId: ", tokenId);
    console.log("Metadata: ", JSON.stringify(metadata));
    console.log("Metadata2: ", metadata);

    try {
      let result = await kaliNFT.methods
        .mint(
          dao,
          tokenId, // tokenId,
          desc, // tokenURI
        )
        .send({ from: accounts[0] })

      console.log("This is the result", result)
      // let dao = result["events"]["DAOdeployed"]["returnValues"]["kaliDAO"];

      // Router.push({
      //   pathname: "/daos/[dao]",
      //   query: { dao: dao },
      // })

    } catch (e) {
      alert(e);
      console.log(e);
    }

    toggleLoading();
  };

  const initialValues = {
    title: "",
    desc: "",
    image: ""
  };

  const validationSchema = Yup.object({
    title: Yup.string().required("Required"),
    desc: Yup.string().required("Required"),
    image: Yup.string().required("Required"),
  })

  const optionsDocs = [
    { key: "Select a DAO", value: "" },
    { key: "Code of Conduct", value: "COC" },
    { key: "UNA", value: "UNA" },
    { key: "LLC", value: "LLC" },
  ];

  return (
    <FlexGradient>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleNftSubmit}
      >
        {() => (
          <Form>
            <FormikControl
              control="input"
              type="text"
              label="Title"
              name="title"
              placeholder="Title of NFT"
            />
            <FormikControl
              control="textarea"
              type="text"
              label="Description"
              name="desc"
              placeholder="Description for NFT"
            />
            <FormikControl
              control="input"
              label="Image"
              name="image"
              placeholder="URL"
            />
            <br />
            <Button type="submit">Summon</Button>
          </Form>
        )}
      </Formik>
    </FlexGradient>
  )
}

export default NftForm;
