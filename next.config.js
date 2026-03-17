/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "export",
  images: {
    unoptimized: true
  },
  basePath: "/Tether.web",
  assetPrefix: "/Tether.web/"
};

module.exports = nextConfig;
