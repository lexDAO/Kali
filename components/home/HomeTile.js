import {
  Button,
  Text,
  Stack,
} from "@chakra-ui/react";
import FlexGradient from '../elements/FlexGradient';

export default function HomeTile() {
  return(
    <FlexGradient>
      <Stack spacing={5} p={5} alignItems="center">
        <Text fontSize="xl">
          Launch and automate your business with real DAO magick
        </Text>
      </Stack>
    </FlexGradient>
  )
}
