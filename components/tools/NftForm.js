import React, { useContext } from "react";
import kaliNFT from "../../eth/kaliNFT.js";
import { Button } from "@chakra-ui/react";
import FlexGradient from "../elements/FlexGradient.js";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import FormikControl from "../home/form/FormikControl.js";
import fleek from "@fleekhq/fleek-storage-js";

function NftForm(props) {
  const value = useContext(AppContext);
  const { web3, account, loading, dao } = value.state;

  // Upload file to Fleek Storage
  const upload = async (values) => {
    const input = {
      apiKey: process.env.REACT_APP_FLEEK_API_KEY,
      apiSecret: process.env.REACT_APP_FLEEK_API_SECRET,
      bucket: "f4a2a9f1-7442-4cf2-8b0e-106f14be163b-bucket",
      key: values.title,
      data: values.file,
      httpUploadProgressCallback: (event) => {
        console.log(Math.round((event.loaded / event.total) * 100) + "% done");
      },
    };

    try {
      const result = await fleek.upload(input);
      console.log("Image hash from Fleek: " + result.hash);

      // Construct NFT metadata
      const date = new Date();
      const timestamp = date.getTime();
      const metadata = {
        title: values.title,
        description: values.desc,
        image: result.hash,
        createdAt: timestamp,
      };

      return metadata;
    } catch (e) {
      console.log("Error: " + e);
      alert(e);
    }
  };

  // ----- Upload metadata to Fleek Storage
  const uploadMetadata = async (metadata) => {
    const data = JSON.stringify(metadata);

    // TODO #1 - Store keys as .env
    const input = {
      apiKey: process.env.REACT_APP_FLEEK_API_KEY,
      apiSecret: process.env.REACT_APP_FLEEK_API_SECRET,
      bucket: "f4a2a9f1-7442-4cf2-8b0e-106f14be163b-bucket",
      key: metadata.image,
      data,
    };

    try {
      // Uplaod tokenUri to Fleek
      const result = await fleek.upload(input);
      console.log("Metadata hash from Fleek: " + result.hash);

      return result.hash;
    } catch (e) {
      console.log("Error: " + e, i);
    }
  };

  const handleNftSubmit = async (values) => {
    const tokenId = await kaliNFT.methods.totalSupply().call();
    const metadata = await upload(values);
    const tokenUri = await uploadMetadata(metadata);

    try {
      let result = await kaliNFT.methods
        .mint(dao, tokenId, tokenUri)
        .send({ from: account });

      console.log("This is the result", result);
    } catch (e) {
      alert(e);
      console.log(e);
    }
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
  });

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
            <input
              id="file"
              name="file"
              type="file"
              onChange={(event) => {
                setFieldValue("file", event.target.files[0]);
              }}
            />
            <br />
            <br />
            <Button type="submit">Summon</Button>
          </Form>
        )}
      </Formik>
    </FlexGradient>
  );
}

export default NftForm;
