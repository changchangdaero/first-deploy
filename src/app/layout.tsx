// 전체 사이트 껍데기: 모든 페이지에 폰트, 전역 CSS, 테마 초기화, 공통 헤더, 푸터를 감쌉니다.
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import RevealObserver from '@/components/RevealObserver';
import SiteFooter from '@/components/SiteFooter';
import SiteHeader from '@/components/SiteHeader';
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

const REVEAL_INIT_SCRIPT =
  "if(!matchMedia('(prefers-reduced-motion: reduce)').matches&&'IntersectionObserver' in window)document.documentElement.classList.add('reveal-ready')";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialTheme = await getInitialTheme();

  return (
    // suppressHydrationWarning: 아래 head 스크립트가 그리기 전에 html에 reveal-ready 클래스를 붙이기 때문입니다.
    <html lang="ko" data-theme={initialTheme} style={{ colorScheme: initialTheme }} suppressHydrationWarning>
      <head>
        {/* 스크롤 리빌 준비: 첫 화면이 그려지기 전에 숨김 상태를 켜서, 보였다가 사라지는 깜빡임을 막습니다. */}
        <script dangerouslySetInnerHTML={{ __html: REVEAL_INIT_SCRIPT }} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        <SiteHeader initialTheme={initialTheme} />
        {children}
        <SiteFooter />
        <RevealObserver />
      </body>
    </html>
  );
}
