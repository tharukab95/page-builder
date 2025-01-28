const { spacingClassMapping } = require("./constants");
const Color = require("./theme/colors/colors.cjs");

module.exports = {
  theme: {
    extend: {
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1440px",
      },
      spacing: spacingClassMapping,
      maxWidth: {
        "grid-container": "85%",
      },
      gridTemplateColumns: {
        "grid-layout": "repeat(auto-fill, minmax(75px, 1fr))",
      },
      fontFamily: {
        sans: ["var(--font-onest)", "Onest", "sans-serif"],
      },
      fontSize: {
        display1: ["48px", { lineHeight: "72px" }],
        display2: ["40px", { lineHeight: "60px" }],
        h1: ["32px", { lineHeight: "48px" }],
        h2: ["28px", { lineHeight: "42px" }],
        h3: ["24px", { lineHeight: "36px" }],
        h4: ["20px", { lineHeight: "30px" }],
        h5: ["18px", { lineHeight: "27px" }],
        h6: ["16px", { lineHeight: "24px" }],
        body1: ["16px", { lineHeight: "28px" }],
        body2: ["14px", { lineHeight: "24px" }],
      },
      fontWeight: {
        extrabold: 800,
        bold: 700,
        semibold: 600,
        medium: 500,
        normal: 400,
        light: 300,
      },
      backgroundImage: {
        "primary-gradient": `linear-gradient(81deg, ${Color.Primary.Gradients.Idle[0]} 0%, ${Color.Primary.Gradients.Idle[1]} 100%)`,
        "primary-gradient-hover": `linear-gradient(81deg, ${Color.Primary.Gradients.Hover[0]} 0%, ${Color.Primary.Gradients.Hover[1]} 100%)`,
        "secondary-gradient": `linear-gradient(81deg, ${Color.Secondary.Gradients.Idle[0]} 0%, ${Color.Secondary.Gradients.Idle[1]} 100%)`,
        "secondary-gradient-hover": `linear-gradient(81deg, ${Color.Secondary.Gradients.Hover[0]} 0%, ${Color.Secondary.Gradients.Hover[1]} 100%)`,
      },
      colors: Color,
      boxShadow: {
        "gray-inner": `0 0 0 1.5px ${Color.Gray.Tint[80]} inset`,
      },
    },
    colors: {
      // Primary colors
      primary: Color.Primary.default,
      "primary-tint-80": Color.Primary.Tint[80],
      "primary-tint-60": Color.Primary.Tint[60],
      "primary-tint-40": Color.Primary.Tint[40],
      "primary-tint-20": Color.Primary.Tint[20],
      "primary-tint-10": Color.Primary.Tint[10],
      "primary-shade-80": Color.Primary.Shade[80],
      "primary-shade-60": Color.Primary.Shade[60],
      "primary-shade-40": Color.Primary.Shade[40],
      "primary-shade-20": Color.Primary.Shade[20],
      "primary-shade-10": Color.Primary.Shade[10],

      // Secondary colors
      secondary: Color.Secondary.default,
      "secondary-tint-80": Color.Secondary.Tint[80],
      "secondary-tint-60": Color.Secondary.Tint[60],
      "secondary-tint-40": Color.Secondary.Tint[40],
      "secondary-tint-20": Color.Secondary.Tint[20],
      "secondary-tint-10": Color.Secondary.Tint[10],
      "secondary-shade-80": Color.Secondary.Shade[80],
      "secondary-shade-60": Color.Secondary.Shade[60],
      "secondary-shade-40": Color.Secondary.Shade[40],
      "secondary-shade-20": Color.Secondary.Shade[20],
      "secondary-shade-10": Color.Secondary.Shade[10],

      // Gray colors
      gray: Color.Gray.default,
      "gray-tint-80": Color.Gray.Tint[80],
      "gray-tint-60": Color.Gray.Tint[60],
      "gray-tint-40": Color.Gray.Tint[40],
      "gray-tint-20": Color.Gray.Tint[20],
      "gray-tint-10": Color.Gray.Tint[10],
      "gray-shade-80": Color.Gray.Shade[80],
      "gray-shade-60": Color.Gray.Shade[60],
      "gray-shade-40": Color.Gray.Shade[40],
      "gray-shade-20": Color.Gray.Shade[20],
      "gray-shade-10": Color.Gray.Shade[10],

      // Black
      black: Color.Black.cynical_black,

      // White
      "custom-white": Color.White.igloo_white,
      white: Color.White.default,

      // Status
      success: Color.Status.success.default,
      "success-80": Color.Status.success[80],
      error: Color.Status.error.default,
      "error-shade-90": Color.Status.error.Shade[90].default,
      "error-80": Color.Status.error[80],
      warning: Color.Status.warning.default,
      "warning-80": Color.Status.warning[80],
      information: Color.Status.information.default,
      "information-80": Color.Status.information[80],

      // Transparent
      transparent: Color.Transparent,
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
