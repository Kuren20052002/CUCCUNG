import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      },
      {
        // Allow any HTTPS image source (needed for content from external URLs in posts)
        protocol: 'https',
        hostname: '**',
      },
      {
        // Allow localhost media API in development
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/api/media/**',
      },
    ],
  },
};

export default nextConfig;
