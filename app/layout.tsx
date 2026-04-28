import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import { LazyGA } from "@/app/components/LazyGA";
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
      <body className="flex flex-col">
        <Providers>
          {children}
        </Providers>
        <LazyToaster />
        {/* GA lazy-loaded on first interaction — saves ~300ms on mobile 4G */}
        <LazyGA gaId="G-GKH65E4DSG" />
      </body>
    </html>
  );
}
