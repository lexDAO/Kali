import { useEffect, useState } from "react";
import { Text, Box, HStack, Flex, VStack } from "@chakra-ui/react";

export default function Timer(props) {
  const [time, setTime] = useState(null);
  const [stop, setStop] = useState(false);
  var countDownDate = new Date(props["expires"] * 1000);
  var now = new Date().getTime();
  var distance = countDownDate - now;
  var days = Math.floor(distance / (1000 * 60 * 60 * 24));
  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((distance) => distance - 1);
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    if (distance <= 0 && stop == false) {
      props.setIsExpired(true);
      setStop(true);
      console.log("time", time);
    }
    if (Math.round(now / 1000) >= props.buffer && stop == false) {
      props.setVotingStarted(true);
    }
  }, [time]);

  const TimerBox = (props) => {
    return (
      <Box
        align="center"
        width="50px"
        border="1px solid"
        padding="10px"
        rounded="md"
      >
        {props.children > 0 ? props.children : 0}
      </Box>
    );
  };
  const TimerBoxLabel = (props) => {
    return (
      <Box align="center" width="50px" padding="0px" fontSize="12px">
        {props.children}
      </Box>
    );
  };

  return (
    <VStack>
      <Text>time remaining:</Text>
      <HStack spacing="1">
        <TimerBox>{days}</TimerBox>
        <TimerBox>{hours}</TimerBox>
        <TimerBox>{minutes}</TimerBox>
        <TimerBox>{seconds}</TimerBox>
      </HStack>
      <HStack spacing="1">
        <TimerBoxLabel>d</TimerBoxLabel>
        <TimerBoxLabel>h</TimerBoxLabel>
        <TimerBoxLabel>m</TimerBoxLabel>
        <TimerBoxLabel>s</TimerBoxLabel>
      </HStack>
    </VStack>
  );
}
