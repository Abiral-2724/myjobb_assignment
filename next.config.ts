import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    // Uncomment if you are using server actions, otherwise remove it
    // serverActions: {},
  },
  images: {
    domains: ['cdn.dummyjson.com'],
  },
  typescript: {
    ignoreBuildErrors: true,
    
  },
  env: {
    MONGODB_URI: process.env.MONGODB_URI || "",
  },
};

export default nextConfig;
