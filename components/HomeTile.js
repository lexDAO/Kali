import {
  Button,
  Text,
  Stack,
} from "@chakra-ui/react";
import FlexGradient from './FlexGradient';
export default function HomeTile() {
  return(
    <FlexGradient>
      <Stack spacing={5} p={5} alignItems="center">
        <Text
          fontSize="4xl"
          color="kali.700"
          fontWeight="bold"
          letterSpacing="wide"
        >
          KaliDAO
        </Text>
        <Text fontSize="xl">
          KaliDAO is an optimized DAC framework like you&apos;ve never
          seen before. Move over, Moloch: the queen has arrived.
        </Text>
      </Stack>
    </FlexGradient>
  )
}
