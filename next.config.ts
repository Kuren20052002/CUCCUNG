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
      // Redirect old xe-đẩy articles → consolidated guide
      {
        source: '/goc-review-cho-me-va-be/review-chi-tiet-xe-day-em-be-loai-nao-tot-va-an-toan-nhat-hien-nay',
        destination: '/goc-review-cho-me-va-be/cam-nang-xe-day-em-be',
        permanent: true,
      },
      {
        source: '/goc-review-cho-me-va-be/kinh-nghiem-chon-mua-xe-day-so-sinh',
        destination: '/goc-review-cho-me-va-be/cam-nang-xe-day-em-be',
        permanent: true,
      },
    ];
  },

  images: {
    formats: ['image/avif', 'image/webp'],
    // Optimized for mobile-first — smaller sizes load faster on slow connections
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

  // Performance headers for static assets
  async headers() {
    return [
      {
        // Cache static assets aggressively (fonts, images, JS, CSS)
        source: '/:path*.(woff2|woff|ttf|ico|png|jpg|jpeg|webp|avif|svg|css|js)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  // Experimental optimizations
  experimental: {
    // Enable optimized package imports to reduce bundle size
    optimizePackageImports: ['lucide-react', 'date-fns'],
  },
};

export default nextConfig;

