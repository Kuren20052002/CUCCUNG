import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

export default NextAuth(authConfig).auth;

export const config = {
  // Exclude static files, images, API, and Next.js internals from auth middleware
  // — reduces TTFB for all static resource requests
  matcher: ['/((?!api|_next/static|_next/image|_next/data|favicon\\.ico|icon\\.png|apple-icon\\.png|.*\\.webp$|.*\\.png$|.*\\.svg$|.*\\.jpg$|sitemap\\.xml|robots\\.txt).*)'],
};
