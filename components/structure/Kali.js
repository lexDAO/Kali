import {BrowserView, MobileView} from 'react-device-detect';
import {
  Box,
  Link
} from "@chakra-ui/react";
import { routeHome } from '../../utils/router';

export default function Kali() {
  const home = () => {
    routeHome();
    console.log("click")
  }
  return(
    <Box
      as="h1"
      letterSpacing="wide"
      fontWeight="extrabold"
      fontSize="4xl"
      bgGradient="linear(to-br, kali.900, kali.600)"
      bgClip="text"
      textShadow="2.4px 0.4px kali.900"
      ml={2}
      minW={10}
    >
      <BrowserView><Link onClick={home}>KaliDAO</Link></BrowserView>
    </Box>
  )
}
