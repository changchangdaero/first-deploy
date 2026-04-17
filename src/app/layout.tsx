import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import SiteHeader from '@/components/SiteHeader';
import ThemeScript from '@/components/theme/ThemeScript';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: '유창민의 포트폴리오',
  description: '유창민의 포트폴리오입니다.',
  openGraph: {
    title: '유창민의 포트폴리오',
    description: '유창민의 포트폴리오입니다.',
  },
  twitter: {
    title: '유창민의 포트폴리오',
    description: '유창민의 포트폴리오입니다.',
  },
  icons: {
    icon: '/faviconme.png',
    shortcut: '/faviconme.png',
    apple: '/faviconme.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <ThemeScript />
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
