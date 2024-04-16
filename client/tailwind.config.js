const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    screens: {
      'sm': '768px',
      'md': '1024px',
      'lg': '1080px',
      'xl': '1440px',
      '2xl': '2160px',
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
