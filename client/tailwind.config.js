const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: ["./src/**/*.{js,jsx}"],
  theme: {
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
