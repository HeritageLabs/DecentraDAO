import { extendTheme } from "@chakra-ui/react";
import { createBreakpoints } from "@chakra-ui/theme-tools";

const breakpoints = createBreakpoints({
  sm: "320px",
  md: "768px",
  lg: "1024px",
  xl: "1200px",
  xxl: "1441px",
});

const colors = {
  brand: {
    primary: "#1C1CFF",
    white: "#FFFFFF",
    lightGrey: "#FAF9F7",
    yellow: "#F7E427",
    dark: "#1A202C",
    secondary: "#C2E189",
    orange: "#FE9D1A",
    gray: '#A2ADBE',
    grey: '#F0F2F5',
    bgColor: "#E8F8F9"
  },
};

const fonts = {
  heading: `'Josefin Sans', 'Arimo', san-serif`,
  body: `'Josefin Sans', 'Arimo', san-serif`,
};

const styles = {
  body: {
    fontFamily: "'Josefin Sans', 'Arimo', san-serif",
  },
  "::placeholder": {
    color: "#BABABA",
  },
};

const theme = extendTheme({ colors, styles, fonts, breakpoints });

export default theme;
