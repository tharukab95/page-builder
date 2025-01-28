const { createGlobPatternsForDependencies } = require("@nx/react/tailwind");
const Color = require("./theme/colors/colors.cjs");
const { join } = require("path");

/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require("../../tailwind-workspace.config")],
  content: [
    join(
      __dirname,
      "{src,pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html}"
    ),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {
      boxShadow: {
        "linear-chart-tooltip": "0px 1px 20px rgba(0, 0, 0, 0.1)", // Tailwind uses RGBA for color values
        "domain-card": "0px 3px 32px rgba(0, 0, 0, 0.1)",
      },
      borderColor: {
        "warning-80": "#FFC32180",
        "primary-80": "#7E34A580",
      },
      width: {
        content: "calc(100% - 220px)",
      },
    },
  },

  plugins: [
    require("@tailwindcss/container-queries"),
    function ({ addUtilities, theme }) {
      const newUtilities = {
        ".active-card-border-gradient": {
          border: "1px solid transparent",
          "background-origin": "border-box",
          "background-clip": "padding-box, border-box",
          "background-image": `linear-gradient(${Color.White.default}, ${Color.White.default}), linear-gradient(71deg, ${Color.Secondary.default}  0%, ${Color.Primary.default} 100%)`,
        },
        ".inactive-card-border-gradient": {
          border: "1px solid transparent",
          "background-origin": "border-box",
          "background-clip": "padding-box, border-box",
          "background-image": `linear-gradient(${Color.Gray.Tint[10]}, ${Color.Gray.Tint[10]}), linear-gradient(71deg, ${Color.Secondary.default}  0%, ${Color.Primary.default} 100%)`,
        },
        ".bg-gradient-sidePanel": {
          background: `linear-gradient(165deg, ${theme(
            "colors.secondary-tint-10"
          )} 0%, ${theme("colors.primary-tint-10")} 100%)`,
        },
        ".bg-gradient-imageUploader": {
          background: "linear-gradient(48deg, #EBF3FA 0%, #F1EBF6 100%)",
        },
        ".bg-gradient-sidePanelTab": {
          background: `linear-gradient(33deg, rgba(55, 148, 219, 0.1) 0%, rgba(126, 52, 165, 0.1) 100%)`,
        },
        ".bg-gradient-sidePanelTabHover": {
          background: `linear-gradient(33deg, rgba(55, 148, 219, 0.05) 0%, rgba(126, 52, 165, 0.05) 100%)`,
        },
        ".bg-gradient-topSalesCard": {
          background: `transparent linear-gradient(14deg, rgba(55, 148, 219, 1) 0%, rgba(126, 52, 165, 1) 100%)`,
        },
        ".bg-gradient-topSalesCardLayer1": {
          background: `linear-gradient(16deg, rgba(126, 52, 165, 0.3) 0%, rgba(55, 148, 219, 0.2) 100%)`,
        },
        ".bg-gradient-topSalesCardLayer2": {
          background: `linear-gradient(14deg, rgba(126, 52, 165, 0.3) 0%, rgba(55, 148, 219, 0.2) 100%)`,
        },
        ".bg-gradient-domainsFreeCard": {
          background: `linear-gradient(180deg, #F5F1F5 0%, #F1F6F8 100%)`,
        },
        ".bg-gradient-domainPresentCard": {
          background:
            "linear-gradient(244deg, rgba(55, 148, 219, 1) 0%, rgba(126, 52, 165, 1) 100%)",
        },
        ".bg-gradient-available-cards": {
          background: `transparent linear-gradient(263deg, ${Color.Primary.Tint[10]} 0%, ${Color.Secondary.Tint[10]} 100%) 0% 0% no-repeat padding-box`,
        },
        ".bg-gradient-withdraw-cards": {
          background: `transparent linear-gradient(75deg, ${Color.Primary.default} 0%, ${Color.Secondary.default} 100%) 0% 0% no-repeat padding-box`,
        },
        ".bg-text-control": {
          background: `linear-gradient(52deg, rgba(235, 243, 250, 1) 0%, rgba(241, 235, 246, 1) 100%)`,
        },
        ".bg-text-control-selected": {
          background: `linear-gradient(52deg, ${Color.Primary.Gradients.Idle[0]} 0%, ${Color.Primary.Gradients.Idle[1]} 100%)`,
        },
        ".bg-gradient-puckSelectedPageItem": {
          background: `linear-gradient(90deg, #338BCF1A 0%, #7E34A51A 100%)`,
        },
      };
      addUtilities(newUtilities, ["responsive", "hover"]);
    },
  ],
};
