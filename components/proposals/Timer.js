import { useEffect, useState } from "react";
import { Text, HStack, Flex } from "@chakra-ui/react";

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
      <Text>
        {props.children > 0 ? (props.children < 10 ? 0 + props.children.toString() : props.children) : "00"}
      </Text>
    );
  };

  return (
      <HStack className="timer" spacing="0">
        <TimerBox>{days}</TimerBox><Text>:</Text>
        <TimerBox>{hours}</TimerBox><Text>:</Text>
        <TimerBox>{minutes}</TimerBox><Text>:</Text>
        <TimerBox>{seconds}</TimerBox>
      </HStack>
  );
}
