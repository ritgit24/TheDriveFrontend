import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // This disables ESLint errors from failing the build
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
