import type { Metadata } from "next";
import { Geist, Geist_Mono, Be_Vietnam_Pro, Inter } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Toaster } from "sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Self-hosted via next/font (no render-blocking CDN request)
const beVietnamPro = Be_Vietnam_Pro({
  variable: "--font-be-vietnam",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "ngoanxinhyeu - Cộng đồng Mẹ & Bé",
    template: "%s | ngoanxinhyeu",
  },
  icons: {
    icon: '/ngoanxinhyeu_logo.png',
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
    "ngoanxinhyeu"
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
    siteName: "ngoanxinhyeu",
    locale: "vi_VN",
    type: "website",
    images: [
      {
        url: "/ngoanxinhyeu_logo.png",
        width: 250,
        height: 100,
        alt: "ngoanxinhyeu Logo",
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
      className={`${geistSans.variable} ${geistMono.variable} ${beVietnamPro.variable} ${inter.variable} antialiased`}
    >
      <body className="flex flex-col">
        <Providers>
          {children}
        </Providers>
        <Toaster position="top-right" duration={3500} richColors closeButton />
      </body>
      <GoogleAnalytics gaId="G-GKH65E4DSG" />
    </html>
  );
}
