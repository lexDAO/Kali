import React, { useContext, useEffect } from "react";
import AppContext from "../../context/AppContext";
import Router from "next/router";
import {
  FormErrorMessage,
  FormLabel,
  FormControl,
  Input,
  Textarea,
  Button,
  Select,
  Grid,
  GridItem,
  Heading,
  HStack,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  List,
  ListItem,
  IconButton,
  Switch,
} from "@chakra-ui/react";
import FlexGradient from "../elements/FlexGradient";
import { addresses } from "../../constants/addresses";
import { factoryInstance } from "../../eth/factory";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { errorMessages } from "../../constants/errors";
import { AiOutlineDelete } from "react-icons/ai";
import Account from "../structure/Account";

export default function FactoryForm({ initialValues }) {
  const value = useContext(AppContext);
  const { web3, account, chainId, loading } = value.state;
  const {
    handleSubmit,
    register,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: initialValues,
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "founders",
  });

  const handleFactorySubmit = async (values) => {
    console.log("Form: ", values);

    if (!web3 || web3 == null) {
      value.toast(errorMessages["connect"]);
      return;
    }
    value.setLoading(true);

    let factory;
    try {
      factory = factoryInstance(addresses[chainId]["factory"], web3);
    } catch (e) {
      value.toast(e);
    }
    let govSettings = "0,60,0,0,0,0,0,0,0,0,0,0,0";
    const extensions = new Array(0);
    const extensionsData = new Array(0);

    const {
      name,
      symbol,
      docs,
      founders,
      transferability,
      votingPeriod,
      votingPeriodUnit,
    } = values;

    if (transferability) {
      govSettings = "0,60,0,0,0,0,0,0,0,1,0,0,0";
    }
    // convert shares to wei
    let sharesArray = [];
    for (let i = 0; i < founders.length; i++) {
      sharesArray.push(web3.utils.toWei(founders[i].share));
    }
    console.log("Shares Array", sharesArray);

    // voters ENS check
    let votersArray = [];
    for (let i = 0; i < founders.length; i++) {
      votersArray.push(founders[i].address);
    }

    for (let i = 0; i < votersArray.length; i++) {
      if (votersArray[i].includes(".eth")) {
        votersArray[i] = await web3.eth.ens
          .getAddress(votersArray[i])
          .catch(() => {
            value.toast("ENS not found");
          });
      }
    }
    console.log("Voters Array", votersArray);
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
    } else if (docs == "none") {
      docs = "none";
    } else if (docs == "ricardian") {
      docs = "";
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
          votersArray,
          sharesArray,
          votingPeriod,
          govSettings.split(",")
        )
        .send({ from: account });

      let dao = result["events"]["DAOdeployed"]["returnValues"]["kaliDAO"];
      console.log(dao);
      console.log(result);

      Router.push({
        pathname: "/daos/[dao]",
        query: { dao: dao },
      });
    } catch (e) {
      value.toast(e);
      console.log(e);
    }

    value.setLoading(false);
  };

  useEffect(() => {
    append({ address: "" });
  }, []);

  const optionsDocs = [
    { key: "Code of Conduct", value: "COC" },
    { key: "UNA", value: "UNA" },
    { key: "LLC", value: "LLC" },
    { key: "Ricardian LLC Series", value: "ricardian" },
    { key: "None", value: "none" },
  ];

  const optionsVotingPeriod = [
    { key: "Minutes", value: "minutes" },
    { key: "Hours", value: "hours" },
    { key: "Days", value: "days" },
  ];

  console.log("account", account);
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

      <Grid
        as="form"
        onSubmit={handleSubmit(handleFactorySubmit)}
        templateColumns="repeat(2, 1fr)"
        gap={3}
      >
        <GridItem colSpan={2}>
          <FormControl isRequired>
            <FormLabel htmlFor="name">Name</FormLabel>
            <Input
              id="name"
              placeholder="KaliDAO"
              {...register("name", { required: "You must name your DAO!" })}
            />
          </FormControl>
        </GridItem>
        <GridItem colSpan={2}>
          <FormControl isRequired>
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
          <FormControl isRequired>
            <FormLabel htmlFor="docs">Document</FormLabel>
            <Select
              id="docs"
              color="kali.800"
              bg="kali.900"
              opacity="0.90"
              placeholder="Select document"
              {...register("docs")}
            >
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
        <GridItem colSpan={2}>
          <List spacing={2}>
            {fields.map((founder, index) => (
              <ListItem
                display="flex"
                flexDirection="row"
                alignContent="center"
                justifyContent="center"
                key={founder.id}
              >
                <Controller
                  name={`founders.${index}.address`}
                  control={control}
                  defaultValue={founder.address}
                  render={({ field }) => (
                    <FormControl isRequired>
                      <FormLabel htmlFor={`founders.${index}.address`}>
                        Founder
                      </FormLabel>
                      <Input
                        placeholder="0x address or ENS"
                        {...field}
                        {...register(`founders.${index}.address`, {
                          required: "You must assign share!",
                        })}
                      />
                    </FormControl>
                  )}
                />
                <Controller
                  name={`founders.${index}.share`}
                  control={control}
                  defaultValue={founder.share}
                  render={({ field }) => (
                    <FormControl isRequired>
                      <FormLabel htmlFor={`founders.${index}.share`}>
                        Share {index + 1}
                      </FormLabel>
                      <Input
                        placeholder="1"
                        {...field}
                        {...register(`founders.${index}.share`, {
                          required: "You must assign share!",
                        })}
                      />
                    </FormControl>
                  )}
                />
                <IconButton
                  aria-label="delete founder"
                  isRound
                  variant="ghost"
                  _hover={{ bg: "kali.600" }}
                  mt={8}
                  ml={2}
                  icon={<AiOutlineDelete />}
                  onClick={() => remove(index)}
                />
              </ListItem>
            ))}
          </List>
        </GridItem>
        <GridItem colSpan={2}>
          <Button onClick={() => append({ address: "" })}>Add Founder</Button>
        </GridItem>

        <GridItem colSpan={2}>
          <Heading as="h3">Governance Settings</Heading>
        </GridItem>
        <GridItem colSpan={1}>
          <FormControl isRequired>
            <FormLabel htmlFor="votingPeriod">Voting Period</FormLabel>
            <Controller
              name="votingPeriod"
              control={control}
              rules={{ required: true }}
              defaultValue={3}
              render={({ field: { ref, ...restField } }) => (
                <NumberInput {...restField}>
                  <NumberInputField ref={ref} name={restField.name} />
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
              )}
            />
          </FormControl>
        </GridItem>
        <GridItem colSpan={1}>
          <FormControl isRequired>
            <FormLabel htmlFor="votingPeriodUnit">Voting Period Unit</FormLabel>
            <Select
              id="votingPeriodUnit"
              placeholder="Select voting period unit"
              color="kali.800"
              bg="kali.900"
              opacity="0.90"
              {...register("votingPeriodUnit", {
                required: "You must select a voting period unit!",
              })}
            >
              {optionsVotingPeriod.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.key}
                </option>
              ))}
            </Select>
          </FormControl>
        </GridItem>
        <GridItem colSpan={2}>
          <FormControl isRequired>
            <FormLabel htmlFor="transferability">
              Share Transferability
            </FormLabel>
            <Switch
              id="transferability"
              size="lg"
              colorScheme="red"
              {...register("transferability")}
            />
          </FormControl>
        </GridItem>
        <GridItem colSpan={2}>
          {account ? (
            <Button
              type="submit"
              variant="solid"
              isLoading={isSubmitting}
              isFullWidth
            >
              Summon!
            </Button>
          ) : (
            <Account message="Connect wallet" isFullWidth />
          )}
        </GridItem>
      </Grid>
    </FlexGradient>
  );
}
