import React, { useState } from "react";
import { Flex, VStack, Progress, Button, Text } from "@chakra-ui/react";
import ChooseNetwork from "./ChooseNetwork";
import ChooseName from "./ChooseName";
import ChooseType from "./ChooseType";
import Customized from "./Customized";
import ChooseMembers from "./ChooseMembers";
import ChooseDocs from "./ChooseDocs";
import Checkout from "./Checkout";
import StepProgressBar from "./StepProgressBar";

export default function FactoryWrapper() {

  const [visible, setVisible] = useState(0);
  const [details, setDetails] = useState({
    network: 999,
    daoName: null,
    symbol: null,
    daoType: null,
    members: null,
    shares: null,
    votingPeriod: 60,
    paused: 1,
    quorum: 10,
    supermajority: 60,
    extensions: null,
    docs: null,
    docType: null
  });
  console.log("details", details);

  const handleNext = () => {
    setVisible(visible + 1);
  }

  const handleBack = (num) => {
    if(num < visible) {
      setVisible(num);
    }
  }

  const views = [
    <ChooseNetwork key="0" details={details} setDetails={setDetails} handleNext={handleNext} />,
    <ChooseName key="1" details={details} setDetails={setDetails} handleNext={handleNext} />,
    <ChooseType key="2" details={details} setDetails={setDetails} handleNext={handleNext} />,
    <ChooseMembers key="3" details={details} setDetails={setDetails} handleNext={handleNext} />,
    <ChooseDocs key="4" details={details} setDetails={setDetails} handleNext={handleNext} />,
    <Checkout key="5" details={details} setDetails={setDetails} handleNext={handleNext} />
  ];

  return (
    <VStack>
      <StepProgressBar steps={views.length} visible={visible} handleBack={handleBack} />
      {views[visible]}
    </VStack>
  );
}
