import type { Metadata } from "next";
import { Geist, Geist_Mono, Poppins } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";

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
});

const title = "Twibbon PKKMB Polkesma 2025";
const description = "Twibbon Generator untuk PKKMB Politeknik Negeri Malang Tahun Ajaran 2025/2026";

export const metadata: Metadata = {
  title: title,
  description: description,
  icons: "/favico.ico",
  keywords: [
    "Twibbon", "PKKMB", "Polkesma", "Politeknik Negeri Malang", "Twibbon Generator", 
    "Tahun Ajaran 2025", "2026", "Logo Polkesma", "Polkesma Muda 2024"
  ],
  openGraph: {
    title: title,
    description: description,
    url: "https://www.twibbon-polkesma.zone.id",
    siteName: "Twibbon PKKMB Polkesma 2025",
    images: [
      {
        url: "https://www.twibbon-polkesma.zone.id/logos/polkesma-muda-2024.webp",
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
    images: ["https://www.twibbon-polkesma.zone.id/logos/polkesma-muda-2024.webp"],
  },
  robots: "index, follow",
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
