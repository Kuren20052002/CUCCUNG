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
        // F0: Add Vary header to ALL responses for proper gzip/brotli cache negotiation
        // Without this, proxies may serve wrong encoding to clients
        source: '/:path*',
        headers: [
          {
            key: 'Vary',
            value: 'Accept-Encoding',
          },
        ],
      },
      {
        // F40 + D68: Static assets — aggressive cache + cookie-free
        // Cache-Control: immutable tells browser to never revalidate (saves conditional GETs)
        // Set-Cookie: '' header prevents server from setting cookies on static responses
        source: '/:path*.(woff2|woff|ttf|ico|png|jpg|jpeg|webp|avif|svg|css|js|map)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            // F40: Prevent cookies from being set on static asset responses
            key: 'Set-Cookie',
            value: '',
          },
        ],
      },
      // Note: _next/static and _next/image are handled by Next.js automatically
      // with optimal Cache-Control headers. Cookie-free delivery for .js/.css
      // files is already covered by the general static asset matcher above.
    ];
  },

  // Experimental optimizations
  experimental: {
    // Enable optimized package imports to reduce bundle size
    optimizePackageImports: ['lucide-react', 'date-fns'],
  },
};

export default nextConfig;

