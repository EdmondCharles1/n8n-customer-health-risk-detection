import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Limit build concurrency for predictable resource use on CI and Windows.
  experimental: {
    cpus: 1,
  },
};

export default nextConfig;
