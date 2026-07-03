// 전체 사이트 껍데기: 모든 페이지에 폰트, 전역 CSS, 테마 초기화, 공통 헤더를 감쌉니다.
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { cookies } from 'next/headers';

import SiteFooter from '@/components/SiteFooter';
import SiteHeader from '@/components/SiteHeader';
import './globals.css';

type Theme = 'light' | 'dark';

const THEME_STORAGE_KEY = 'portfolio-theme';

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

function getInitialTheme(themeCookie?: string): Theme {
  return themeCookie === 'dark' ? 'dark' : 'light';
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const initialTheme = getInitialTheme(cookieStore.get(THEME_STORAGE_KEY)?.value);

  return (
    <html lang="ko" data-theme={initialTheme} style={{ colorScheme: initialTheme }}>
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        <SiteHeader initialTheme={initialTheme} />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
