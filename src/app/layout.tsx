import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import BackButton from "@/components/BackButton";
import HomeButton from "@/components/HomeButton";
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
  title: "유창민의 포트폴리오",
  description: "유창민의 포트폴리오입니다.",
  openGraph: {
    title: "유창민의 포트폴리오",
    description: "유창민의 포트폴리오입니다.",
  },
  twitter: {
    title: "유창민의 포트폴리오",
    description: "유창민의 포트폴리오입니다.",
  },
  icons: {
    icon: "/faviconme.png",
    shortcut: "/faviconme.png",
    apple: "/faviconme.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <BackButton />
        <HomeButton />
        {children}
      </body>
    </html>
  );
}
