import { ChakraProvider, extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  components: {
    Button: {
      defaultProps: {
        colorScheme: "kali",
      },
      baseStyle: {
        display: "flex",
        justifyContent: "center",
        alignItem: "center",
        border: "1px",
      },
    },
  },
  colors: {
    kali: {
      100: "#46254A", // american purple
      200: "#294A25", // pomona green
      300: "#34254A", // russian violet
      400: "#F4C824", // deep lemon
      500: "#F03B361", // rajah
      600: "#B82623", // firebrick
      700: "#F74D38", // ogre odor
      800: "#0c0101", // black
      900: "#fffefe", // white
    },
  },
  styles: {
    global: {
      body: {
        bg: "kali.800",
        color: "kali.900",
      },
    },
  },
});

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default MyApp;
