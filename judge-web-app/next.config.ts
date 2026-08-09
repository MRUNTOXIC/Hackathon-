import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  typescript: { ignoreBuildErrors: true },
  compress: true,
  experimental: {
    optimizePackageImports: ['framer-motion', 'lucide-react'],
  },
  allowedDevOrigins: ['192.168.1.100'],
};

export default nextConfig;
