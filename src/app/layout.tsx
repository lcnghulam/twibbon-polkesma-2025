import type { Metadata } from "next";
import { Geist, Geist_Mono, Poppins } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-poppins',
})

const title = "Twibbon SPMB Polkesma 2025";
const description = "Twibbon Generator untuk Maba Politeknik Negeri Malang Tahun Ajaran 2025/2026";
export const metadata: Metadata = {

  title: title,
  description: description,
  icons: "/favico.ico",

  openGraph: {
    title: title,
    description: description,
    url: "https://www.twibbon-polkesma.zone.id",
    siteName: "Twibbon SPMB Polkesma 2025",
    images: [
      {
        url: "https://www.twibbon-polkesma.zone.id/logo-polkesma.png",
        width: 512,
        height: 512,
        alt: "Polkesma Twibbon's Logo",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: title,
    description: description,
    images: ["https://www.twibbon-polkesma.zone.id/logo-polkesma.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
