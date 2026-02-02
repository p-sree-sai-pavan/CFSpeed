import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingRoot: __dirname,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },
  outputFileTracingIncludes: {
    '/api/**/*': ['./public/categories/**/*'],
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
    staleTimes: {
      dynamic: 300, // Cache dynamic pages in router for 5 minutes
    },
  },
};

export default nextConfig;
