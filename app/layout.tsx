import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-GKH65E4DSG"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-GKH65E4DSG');
          `}
        </Script>

        <Providers>
          {children}
        </Providers>
        <Toaster position="top-right" duration={3500} richColors closeButton />
      </body>
    </html>
  );
}
