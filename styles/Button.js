const Button = {
  baseStyle: {
    display: "flex",
    justifyContent: "center",
    alignItem: "center",
    border: "1px",
  },
  variants: {
    outline: (props) => ({
      bg: props.colorMode === "dark" ? "kali.700" : "kali.900",
      color: props.colorMode === "dark" ? "kali.900" : "kali.800",
    }),
    ghost: (props) => ({
      bg: props.colorMode === "dark" ? null : null,
      color: props.colorMode === "dark" ? "kali.900" : "kali.800",
    }),
    solid: (props) => ({
      bg: props.colorMode === "dark" ? "kali.700" : "kali.900",
      color: props.colorMode === "dark" ? "kali.900" : "kali.800",
    }),
  },
  defaultProps: {
    colorScheme: "kali",
  },
};

export default Button;
