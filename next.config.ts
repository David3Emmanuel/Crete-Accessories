import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "1337",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: process.env.STRAPI_HOST ?? "",
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;
