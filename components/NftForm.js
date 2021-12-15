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
import fleek from "@fleekhq/fleek-storage-js"

function NftForm(props) {
  const { toggleLoading, dao } = props;

  // Upload file to Fleek Storage
  const upload = async (values) => {
    // TODO #1 - Store keys as .env
    const input = {
      apiKey: "W4R0lBRnWsIgoiAWTjLvCw==",
      apiSecret: "/7tzFGnOoybHmrBPyu4f5WeZWpjsjDsZ5Bn9fMNoyfw=",
      bucket: "f4a2a9f1-7442-4cf2-8b0e-106f14be163b-bucket",
      key: values.title,
      data: values.file,
      httpUploadProgressCallback: (event) => {
        console.log(Math.round((event.loaded / event.total) * 100) + "% done")
      },
    }

    try {
      const result = await fleek.upload(input)
      console.log("Image hash from Fleek: " + result.hash)

      // Construct NFT metadata
      const date = new Date()
      const timestamp = date.getTime()
      const metadata = {
        title: values.title,
        description: values.desc,
        image: result.hash,
        createdAt: timestamp
      }

      return metadata

    } catch (e) {
      console.log("Error: " + e)
      alert(e)
    }
  }

  // ----- Upload metadata to Fleek Storage
  const uploadMetadata = async (metadata) => {
    const data = JSON.stringify(metadata)

    // TODO #1 - Store keys as .env
    const input = {
      apiKey: "W4R0lBRnWsIgoiAWTjLvCw==",
      apiSecret: "/7tzFGnOoybHmrBPyu4f5WeZWpjsjDsZ5Bn9fMNoyfw=",
      bucket: "f4a2a9f1-7442-4cf2-8b0e-106f14be163b-bucket",
      key: metadata.image,
      data,
    }

    try {
      // Uplaod tokenUri to Fleek
      const result = await fleek.upload(input)

      return result.hash

    } catch (e) {
      console.log("Error: " + e, i)
    }
  }

  const handleNftSubmit = async (values) => {
    toggleLoading();

    const accounts = await web3.eth.getAccounts();
    const tokenId = await kaliNFT.methods.totalSupply().call();
    const metadata = await upload(values)
    const tokenUri = await uploadMetadata(metadata)

    // console.log("Account: ", accounts[0]);
    // console.log("KaliNFT tokenId: ", tokenId);
    // console.log(values.file)

    try {
      let result = await kaliNFT.methods
        .mint(
          dao,
          tokenId, 
          tokenUri, 
        )
        .send({ from: accounts[0] })

      console.log("This is the result", result)

    } catch (e) {
      alert(e);
      console.log(e);
    }

    toggleLoading();
  };

  const initialValues = {
    title: "",
    desc: "",
    file: "",
  };

  const validationSchema = Yup.object({
    title: Yup.string().required("Required"),
    desc: Yup.string().required("Required"),
    // TODO #2 - Validate a file is selected
  })

  return (
    <FlexGradient>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleNftSubmit}
      >
        {({ setFieldValue }) => (
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
            <br />
            {/* TODO #3 - Conform this to FormikControl for consistency */}
            <input
              id="file"
              name="file"
              type="file"
              onChange={(event) => {
                setFieldValue("file", event.target.files[0])
              }}
            />
            <br />
            <br />
            <Button type="submit">Summon</Button>
          </Form>
        )}
      </Formik>
    </FlexGradient>
  )
}

export default NftForm;
