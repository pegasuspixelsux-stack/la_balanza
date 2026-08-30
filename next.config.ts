import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root: a stray package-lock.json lives one level up in
  // ~/Desktop/Projects, which Turbopack would otherwise treat as the root.
  turbopack: {
    root: __dirname,
  },
  images: {
    qualities: [75, 90],
  },
};

export default nextConfig;
