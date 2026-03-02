import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Tanpa output: "export" supaya build di Vercel jalan (Vercel pakai server mode)
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
