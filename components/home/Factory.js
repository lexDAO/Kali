import React, { useState } from "react";
import FlexGradient from "../elements/FlexGradient";
import FactoryForm from "./FactoryForm";
import { Button, Grid, GridItem, Heading } from "@chakra-ui/react";

function Factory() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(false);

  const handleOpen = (type) => {
    if (type === "social") {
      setValue({ docs: "COC", votingPeriod: "12", votingPeriodUnit: "hours" });
    } else if (type === "investment") {
      setValue({ docs: "LLC", votingPeriod: "24", votingPeriodUnit: "hours" });
    } else if (type === "service") {
      setValue({
        docs: "ricardian",
        votingPeriod: "24",
        votingPeriodUnit: "hours",
      });
    }
    setOpen(true);
  };

  return (
    <FlexGradient>
      {open ? (
        <FactoryForm initialValues={value} />
      ) : (
        <Grid templateColumns="repeat(3, 1fr)" gap={3}>
          <GridItem colSpan={3}>
            <Heading>Choose your adventure!</Heading>
          </GridItem>
          <Button p={10} onClick={() => handleOpen("social")}>
            Social DAO
          </Button>
          <Button p={10} onClick={() => handleOpen("investment")}>
            Investment DAO
          </Button>
          <Button p={10} onClick={() => handleOpen("service")}>
            Service DAO
          </Button>
          <Button p={10} onClick={handleOpen}>
            Hard Mode
          </Button>
        </Grid>
      )}
    </FlexGradient>
  );
}

export default Factory;
