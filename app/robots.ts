import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/login/', '/api/'],
      },
      {
        // Block AI crawlers from scraping content for model training
        // Note: ChatGPT-User and PerplexityBot are NOT blocked to allow AI search visibility
        userAgent: ['GPTBot', 'Google-Extended', 'Bytespider', 'CCBot', 'ClaudeBot'],
        disallow: '/',
      },
    ],
    sitemap: 'https://ngoanxinhyeu.app/sitemap.xml',
    // NOTE: The `host` directive is deprecated and not used by Google.
    // Canonical domain is enforced via 301 redirect in next.config.ts instead.
  };
}

