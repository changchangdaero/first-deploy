// 전체 사이트 껍데기: 모든 페이지에 폰트, 전역 CSS, 테마 초기화, 푸터를 감쌉니다. 헤더는 섹션별 레이아웃이 담당합니다.
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import SiteFooter from '@/components/SiteFooter';
import { getInitialTheme } from '@/lib/theme';
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
  title: {
    default: 'Changmin.dev',
    template: '%s | Changmin.dev',
  },
  description: 'Hello changmin World!',
  openGraph: {
    title: 'Changmin.dev',
    description: 'Hello changmin World!',
  },
  twitter: {
    title: 'Changmin.dev',
    description: 'Hello changmin World!',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialTheme = await getInitialTheme();

  return (
    <html lang="ko" data-theme={initialTheme} style={{ colorScheme: initialTheme }}>
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
