const path = require("path");
const withPWA = require("next-pwa");

const isProd = process.env.NODE_ENV === "production";

module.exports = withPWA({
    i18n: {
        locales: ["sv"],
        defaultLocale: "sv",
        localeDetection: false,
    },
    sassOptions: {
        includePaths: [path.join(__dirname, "styles")],
        cssModules: true,
    },
    pwa: {
        dest: "public",
        register: true,
        skipWaiting: true,
        disable: !isProd, // ✅ this disables PWA in dev
    },
});
