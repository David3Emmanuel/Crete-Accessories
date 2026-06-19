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

const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL;
const strapiHost = process.env.STRAPI_HOST;

if (strapiHost && strapiHost.trim() !== "") {
  remotePatterns.push({
    protocol: "https" as const,
    hostname: strapiHost.trim(),
    pathname: "/uploads/**",
  });
} else if (strapiUrl) {
  try {
    const url = new URL(strapiUrl);
    if (url.protocol === "https:") {
      remotePatterns.push({
        protocol: "https" as const,
        hostname: url.hostname,
        pathname: "/uploads/**",
      });
    }
  } catch {
    // Ignore invalid URL
  }
}

const nextConfig: NextConfig = {
  cacheComponents: true,
  images: {
    remotePatterns,
  },
};

export default nextConfig;

