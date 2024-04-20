const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    screens: {
      'sm': '900px',
      'md': '1280px',
      'lg': '1600px',
      'xl': '1920px',
      '2xl': '2560px',
      '3xl': '3840px',
    },
    extend: {
      colors: {
        darkgray: {
          100: "#1c1b1b",
          200: "#202020"
        },
        sepia: {
          100: "#F4ECD8",
          200: "#e8dec3"
        }
      }
    },
  },
  plugins: [],
});
