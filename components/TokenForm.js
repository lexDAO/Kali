import React, { useState } from "react"
import kaliToken from "../eth/fixedERC20factory.js"
import web3 from "../eth/web3.js"
import Router from "next/router"
import { Button } from "@chakra-ui/react"
import FlexGradient from "./FlexGradient"
import { Formik, Form } from "formik"
import * as Yup from "yup"
import FormikControl from "./form/FormikControl.js"
import { Input } from "@chakra-ui/react"

function NftForm(props) {
  const { toggleLoading } = props
  const [account, setAccount] = useState(null)

  {
    /* ISSUES
        - quoram, votingPeriod struck at initialValue not updating to value filled in NumberInput 
        - voter-share array soon 
        - disable summon when submitting
    */
  }

  const handleNftSubmit = async (values) => {
    toggleLoading()
    console.log("Token creation Form: ", values)

    const { owner, name, symbol, decimals, supply } = values

    const accounts = await web3.eth.getAccounts()

    console.log("Account: ", accounts[0])

    try {
      let result = await kaliToken.methods
        .deployFixedERC20(
          name, 
          symbol, 
          decimals, 
          owner, 
          supply
          )
        .send({ from: accounts[0] })

      console.log("This is the result", result)
      // let dao = result["events"]["DAOdeployed"]["returnValues"]["kaliDAO"];

      // Router.push({
      //   pathname: "/daos/[dao]",
      //   query: { dao: dao },
      // })
    } catch (e) {
      alert(e)
      console.log(e)
    }

    toggleLoading()
  }

  const initialValues = {
    owner: "",
    name: "",
    symbol: "",
    decimals: 0,
    supply: 0
  }

  const validationSchema = Yup.object({
    owner: Yup.string().required("Required"),
    name: Yup.string().required("Required"),
    symbol: Yup.string().required("Required"),
    decimals: Yup.number().required("Required"),
    supply: Yup.number().required("Required"),
  })

  const optionsDocs = [
    { key: "Select a DAO", value: "" },
    { key: "Code of Conduct", value: "COC" },
    { key: "UNA", value: "UNA" },
    { key: "LLC", value: "LLC" },
  ]

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
              control="select"
              label="DAO"
              name="dao"
              options={optionsDocs}
            />
            <FormikControl
              control="input"
              type="text"
              label="Owner"
              name="owner"
              placeholder="Owner of token"
            />
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
              label="Decimals"
              name="decimals"
              defaultValue={0}
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
  )
}

export default NftForm
