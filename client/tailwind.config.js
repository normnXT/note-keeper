const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        sepia: {
          100: "#F4ECD8",
          200: "#e8dec3"
        }
      }
    },
  },
  plugins: [],
});
