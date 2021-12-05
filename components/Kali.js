import {
  Box,
  Link
} from "@chakra-ui/react";

export default function Kali() {
  return(
    <Box
      display={{ sm: "none", md: "block", lg: "block", xl: "block" }}
      as="h1"
      letterSpacing="wide"
      fontWeight="extrabold"
      fontSize="4xl"
      bgGradient="linear(to-br, kali.900, kali.600)"
      bgClip="text"
      textShadow="2.4px 0.4px kali.900"
      ml={2}
    >
      <Link href="/">KaliDAO</Link>
    </Box>
  )
}
