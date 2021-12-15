import React, { useContext } from "react";
import AppContext from "../../context/AppContext";
import Router from "next/router";
import {
  FormErrorMessage,
  FormLabel,
  FormControl,
  Input,
  Button,
  Select,
  Grid,
  GridItem,
  Heading,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper
} from "@chakra-ui/react";
import FlexGradient from "../elements/FlexGradient";
import { factory_rinkeby } from "../../utils/addresses";
import { factoryInstance } from "../../eth/factory";
import { useForm } from "react-hook-form";

export default function Factory(props) {
  const value = useContext(AppContext);
  const { web3, account, chainId, loading } = value.state;
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();

  const handleFactorySubmit = async (values) => {
    console.log("Form: ", values);
    
      
      value.setLoading(true);
      const factory = factoryInstance(factory_rinkeby, web3);
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
      }

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
          .send({ from: account });

        let dao = result["events"]["DAOdeployed"]["returnValues"]["kaliDAO"];
        console.log(dao)
        console.log(result)

        Router.push({
          pathname: "/daos/[dao]",
          query: { dao: dao },
        });
      } catch (e) {
        alert(e);
        console.log(e);
      }

      value.setLoading(false)
      
  };

  const optionsDocs = [
    { key: "Code of Conduct", value: "COC" },
    { key: "UNA", value: "UNA" },
    { key: "LLC", value: "LLC" },
    { key: "None", value: "none"}
  ];

  const optionsVotingPeriod = [
    { key: "Minutes", value: "minutes" },
    { key: "Hours", value: "hours" },
    { key: "Days", value: "days" },
  ];

  return (
    <FlexGradient>
      {/*
      - Goal
      - Name, Symbol
      - Founder, Share
      - Document
      - Configuration: Voting Period, Voting Period Unit
        */}
      <Heading as="h2">Build a DAO</Heading>
      <form onSubmit={handleSubmit(handleFactorySubmit)}>
        <Grid templateColumns='repeat(2, 1fr)' gap={3}>
          <GridItem colSpan={2}>
            <FormControl isInvalid={errors.name && touched.name}>
                <FormLabel htmlFor="name">Name</FormLabel>
                <Input
                  id="name"
                  placeholder="KaliDAO"
                  {...register("name", { required: "You must name your DAO!" })}
                />
                <FormErrorMessage>
                  {errors.name && errors.name.message}
                </FormErrorMessage>
            </FormControl>
          </GridItem>
          <GridItem colSpan={2}>
            <FormControl isInvalid={errors.symbol}>
                <FormLabel htmlFor="symbol">Symbol</FormLabel>
                <Input
                  id="symbol"
                  placeholder="KALI"
                  {...register("symbol", {
                    required: "You must choose a symbol!",
                  })}
                />
            </FormControl>
          </GridItem>
          <GridItem colSpan={2}>
            <FormControl >
              <FormLabel htmlFor="docs">Document</FormLabel>
              <Select id="docs" variant="outline" placeholder="Select document" {...register("docs")}>
                    {optionsDocs.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.key}
                      </option>
                    ))}
              </Select>
            </FormControl>
          </GridItem>
          <GridItem colSpan={2}>
            <Heading as="h3">Founders</Heading>
          </GridItem>
          <GridItem colSpan={1}>
            <FormControl isInvalid={errors.founders}>
                <FormLabel htmlFor="voters">Founder</FormLabel>
                <Input
                  id="voters"
                  placeholder="0x Address or ENS"
                  {...register("voters", {
                    required: "You must have a founder!",
                  })}
                />
            </FormControl>
          </GridItem>
          <GridItem colSpan={1}>
            <FormControl isInvalid={errors.shares}>
                <FormLabel htmlFor="shares">Share</FormLabel>
                <Input
                  id="shares"
                  placeholder="1"
                  {...register("shares", {
                    required: "Founders need shares!",
                  })}
                />
              </FormControl>
          </GridItem>
          <GridItem colSpan={2}>
            <Heading as="h3">Governance Settings</Heading>
          </GridItem>
          <GridItem colSpan={1}>
            <FormControl>
              <FormLabel htmlFor="votingPeriod">Voting Period</FormLabel>
              <NumberInput
                id="votingPeriod"
                min={0}
                defaultValue={3}
                {...register("votingPeriod")}
              >
                <NumberInputField id="votingPeriod" />
                <NumberInputStepper>
                  <NumberIncrementStepper
                    bg="green.600"
                    _active={{ bg: "green.500" }}
                  />
                  <NumberDecrementStepper
                    bg="red.600"
                    _active={{ bg: "red.500" }}
                  />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>
          </GridItem>
          <GridItem colSpan={1}>
            <FormControl>
                <FormLabel htmlFor="votingPeriodUnit">Voting Period Unit</FormLabel>
                <Select id="votingPeriodUnit" variant="outline" placeholder="Select voting period unit" {...register("votingPeriodUnit")}>
                  {optionsVotingPeriod.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.key}
                    </option>
                  ))}
                </Select>
              </FormControl>
          </GridItem>
          <GridItem colSpan={2}>
            <Button type="submit" isLoading={isSubmitting} isFullWidth>
              Summon!
            </Button>
          </GridItem>
        </Grid>
      </form>
    </FlexGradient>
  );
}
