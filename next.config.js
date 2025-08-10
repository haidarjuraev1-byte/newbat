/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n: {
    locales: ["ru", "tg", "en"],
    defaultLocale: "ru",
    localeDetection: true,
  },
  trailingSlash: false,
  poweredByHeader: false,
  reactStrictMode: true,
  swcMinify: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ["placeholder.svg"],
    formats: ["image/webp", "image/avif"],
    unoptimized: true,
  },
}

module.exports = nextConfig
