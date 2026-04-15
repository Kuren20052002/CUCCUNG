import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/login/', '/signup/'],
    },
    sitemap: 'https://ngoanxinhyeu.app/sitemap.xml',
    host: 'https://ngoanxinhyeu.app',
  };
}
