import {
  Flex,
  Text
} from "@chakra-ui/react";

export default function Message(props) {

  return(
    <Flex>
      <Text>
        <i>{props.children}</i>
      </Text>
    </Flex>
  )
}
