/** @type {import("next").NextConfig} */
module.exports = {
  output: "export",
  poweredByHeader: false,
  reactStrictMode: true,
  images: { unoptimized: true },
  experimental: { cpus: 1 },
}
