/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n: {
    locales: ["en", "zh", "fr"],
    defaultLocale: "en",
    localeDetection: false,
  },
};

export default nextConfig;
