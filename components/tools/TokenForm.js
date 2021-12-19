import React, { useState } from "react";
import kaliToken from "../../eth/kaliToken";
import { Button } from "@chakra-ui/react";
import FlexGradient from "../elements/FlexGradient";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import FormikControl from "../home/form/FormikControl.js";

function TokenForm(props) {
  const value = useContext(AppContext);
  const { web3, account, loading, dao } = value.state;

  const handleNftSubmit = async (values) => {
    toggleLoading();
    console.log("Token creation Form: ", values);
    console.log("DAO Address: ", dao);

    const { name, symbol, supply } = values;

    try {
      let result = await kaliToken.methods
        .deployFixedERC20(name, symbol, 18, dao, web3.utils.toWei(supply))
        .send({ from: account });

      console.log("This is the result", result);
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
    name: "",
    symbol: "",
    supply: 0,
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Required"),
    symbol: Yup.string().required("Required"),
    supply: Yup.number().required("Required"),
  });

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
              label="Name"
              name="name"
              placeholder="Name of token"
            />
            <FormikControl
              control="input"
              type="text"
              label="Symbol"
              name="symbol"
              placeholder="Symbol of token"
            />
            <FormikControl
              control="number-input"
              label="Supply"
              name="supply"
              defaultValue={0}
            />
            <br />
            <Button type="submit">Summon</Button>
          </Form>
        )}
      </Formik>
    </FlexGradient>
  );
}

export default TokenForm;
