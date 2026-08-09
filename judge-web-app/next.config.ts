import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  typescript: { ignoreBuildErrors: true },
  compress: true,
  experimental: {
    optimizePackageImports: ['framer-motion', 'lucide-react'],
  },
};
module.exports = {
  allowedDevOrigins: ['192.168.1.100'],
}
export default nextConfig;
