import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { LazyToaster } from "@/app/components/LazyToaster";
import "./globals.css";

// Load only 3 font weights: regular (400), semibold (600), extrabold (800)
// — reduces font files from 15 → 9, saving ~30KB and 6 network requests on mobile
const beVietnamPro = Be_Vietnam_Pro({
  variable: "--font-be-vietnam",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "600", "800"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#059669",
};

export const metadata: Metadata = {
  title: {
    default: "Ngoan Xinh Yêu - Cộng đồng Mẹ & Bé",
    template: "%s | Ngoan Xinh Yêu",
  },
  description:
    "Hướng dẫn chăm sóc mẹ và bé từ A–Z: giấc ngủ, dinh dưỡng, sức khỏe trẻ sơ sinh. Kinh nghiệm thực tế giúp mẹ nuôi con dễ dàng và đúng cách.",
  keywords: [
    "chăm sóc mẹ và bé",
    "trẻ sơ sinh",
    "nuôi con",
    "giấc ngủ trẻ sơ sinh",
    "dinh dưỡng cho bé",
    "kinh nghiệm làm mẹ",
    "sức khỏe trẻ sơ sinh",
    "blog",
    "danh mục bài viết",
    "Bài viết",
    "blog chia sẻ",
    "ngoanxinhyeu",
    "Ngoan Xinh Yêu",
    "ngoan xinh yêu",
    "ngoanxinhyeu.app",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
  openGraph: {
    siteName: "Ngoan Xinh Yêu",
    locale: "vi_VN",
    type: "website",
    images: [
      {
        url: "/ngoanxinhyeu_logo.webp",
        width: 200,
        height: 200,
        alt: "Ngoan Xinh Yêu Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@ngoanxinhyeu",
    creator: "@ngoanxinhyeu",
  },
};

import { Providers } from "@/app/components/Providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      data-scroll-behavior="smooth"
      className={`${beVietnamPro.variable} antialiased`}
    >
      <head>
        {/* Preconnect to critical origins — saves ~100-200ms connection setup on first visit */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      {/* Organization Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Ngoan Xinh Yêu",
            "url": "https://ngoanxinhyeu.app",
            "logo": "https://ngoanxinhyeu.app/ngoanxinhyeu_logo.webp",
            "description": "Cộng đồng chia sẻ kiến thức chăm sóc mẹ và bé từ A-Z: thai kỳ, trẻ sơ sinh, dinh dưỡng và nuôi dạy con thông minh.",
            "sameAs": [
              "https://facebook.com/ngoanxinhyeu"
            ]
          }),
        }}
      />
      {/* WebSite Schema with SearchAction */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Ngoan Xinh Yêu",
            "url": "https://ngoanxinhyeu.app",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://ngoanxinhyeu.app/search?q={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          }),
        }}
      />
      <body className="flex flex-col">
        <Providers>
          {children}
        </Providers>
        <LazyToaster />
        <GoogleAnalytics gaId="G-GKH65E4DSG" />
      </body>
    </html>
  );
}
