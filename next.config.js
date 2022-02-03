const path = require("path");

module.exports = {
    i18n: {
        locales: ["sv"],
        defaultLocale: "sv",
        localeDetection: false,
    },
    sassOptions: {
        includePaths: [path.join(__dirname, "styles")],
        cssModules: true,
    },
};
