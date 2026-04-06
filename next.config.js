/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",            // make it a static site
  images: { unoptimized: true }, // allow images
  basePath: "/Tether.web",     // your repo name
  assetPrefix: "/Tether.web/", // fix paths
};

module.exports = nextConfig;
