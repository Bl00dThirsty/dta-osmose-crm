import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ['local-origin.dev', '*.local-origin.dev', 'http://192.168.1.6:3000'],
  // Add any other Next.js configuration options here
};

export default nextConfig;