import {
  Text,
  Box,
  HStack,
  Flex
} from "@chakra-ui/react";

export default function Timer(props) {

  var countDownDate = props['expires'];

  var now = new Date().getTime();

  var distance = countDownDate - now;

  var days = Math.floor(distance / (1000 * 60 * 60 * 24));
  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);

  if(props['open']==false) {
    days = 0;
    hours = 0;
    minutes = 0;
    seconds = 0;
  }

  const TimerBox = (props) => {
    return(
      <Box
        align="center"
        width="50px"
        border="1px solid"
        padding="10px"
        rounded="md"
      >
        {props.children}
      </Box>
    )
  }
  const TimerBoxLabel = (props) => {
    return(
      <Box align="center" width="50px" padding="0px" fontSize="12px">{props.children}</Box>
    )
  }

  return(
    <>
    <HStack spacing="0">
      <TimerBox>{days}</TimerBox>
      <TimerBox>{hours}</TimerBox>
      <TimerBox>{minutes}</TimerBox>
      <TimerBox>{seconds}</TimerBox>
    </HStack>
    <HStack spacing="0">
      <TimerBoxLabel>d</TimerBoxLabel>
      <TimerBoxLabel>h</TimerBoxLabel>
      <TimerBoxLabel>m</TimerBoxLabel>
      <TimerBoxLabel>s</TimerBoxLabel>
    </HStack>
    </>
  )
}
