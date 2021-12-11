import {
  Button,
  Text,
  Stack,
} from "@chakra-ui/react";
import FlexGradient from '../elements/FlexGradient';
import {BrowserView, MobileView, isBrowser} from 'react-device-detect';

export default function HomeTile() {
  return(
    <FlexGradient>
      <Stack spacing={5} p={5} alignItems="center">
        <Text fontSize="xl">
          <BrowserView>
          Launch and automate your business with real DAO magick
          </BrowserView>
          <MobileView>
          MobileView
          </MobileView>
        </Text>
      </Stack>
    </FlexGradient>
  )
}
