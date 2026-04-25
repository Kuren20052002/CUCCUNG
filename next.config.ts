import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable gzip/brotli compression
  compress: true,

  // 301 redirect: www → non-www (canonical domain enforcement)
  // This fixes www.ngoanxinhyeu.app/robots.txt returning 404 and prevents
  // duplicate content between www and non-www versions of every URL.
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.ngoanxinhyeu.app' }],
        destination: 'https://ngoanxinhyeu.app/:path*',
        permanent: true, // HTTP 308 in Next.js (preserves method); SEO-equivalent to 301
      },
    ];
  },

  images: {
    formats: ['image/avif', 'image/webp'],
    // Reduce the number of generated image sizes to minimize build time & CDN cache footprint
    deviceSizes: [640, 750, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
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

  // Experimental optimizations
  experimental: {
    // Enable optimized package imports to reduce bundle size
    optimizePackageImports: ['lucide-react', 'date-fns'],
  },
};

export default nextConfig;

