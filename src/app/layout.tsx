// 전체 사이트 껍데기: 모든 페이지에 폰트, 전역 CSS, 테마 초기화, 공통 헤더를 감쌉니다.
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import SiteFooter from '@/components/SiteFooter';
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
  title: 'Changmin.dev',
  description: '개발자 포트폴리오와 기술 기록 아카이브입니다.',
  openGraph: {
    title: 'Changmin.dev',
    description: '개발자 포트폴리오와 기술 기록 아카이브입니다.',
  },
  twitter: {
    title: 'Changmin.dev',
    description: '개발자 포트폴리오와 기술 기록 아카이브입니다.',
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
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        <ThemeScript />
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
