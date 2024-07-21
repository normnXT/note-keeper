const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
    content: ["./src/**/*.{js,jsx}"],
    theme: {
        screens: {
            "2xs": "300px",
            xs: "640px",
            sm: "900px",
            md: "1280px",
            lg: "1600px",
            xl: "1920px",
            "2xl": "2560px",
            "3xl": "3840px",
        },
        extend: {
            colors: {
                darkgray: {
                    100: "#181716",
                    200: "#2a2727",
                },
                sepia: {
                    100: "#F4ECD8",
                    200: "#e8dec3",
                },
            },
        },
        fontFamily: {
            sans: [
                "ui-sans-serif",
                "system-ui",
                "sans-serif",
                "Apple Color Emoji",
                "Segoe UI Emoji",
                "Segoe UI Symbol",
                "Noto Color Emoji",
            ],
        },
    },
    // corePlugins: {
    // preflight: false,
    // },
    plugins: [],
});
