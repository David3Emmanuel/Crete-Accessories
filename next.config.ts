import type { NextConfig } from "next";

const remotePatterns = [
  {
    protocol: "http" as const,
    hostname: "localhost",
    port: "1337",
    pathname: "/uploads/**",
  },
  {
    protocol: "https" as const,
    hostname: "*.googleusercontent.com",
    pathname: "/**",
  },
  {
    protocol: "https" as const,
    hostname: "lh3.googleusercontent.com",
    pathname: "/**",
  },
];

if (process.env.STRAPI_HOST && process.env.STRAPI_HOST.trim() !== "") {
  remotePatterns.push({
    protocol: "https" as const,
    hostname: process.env.STRAPI_HOST.trim(),
    pathname: "/uploads/**",
  });
}

const nextConfig: NextConfig = {
  cacheComponents: true,
  images: {
    remotePatterns,
  },
};

export default nextConfig;

