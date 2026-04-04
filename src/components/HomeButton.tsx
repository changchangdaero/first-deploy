'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function HomeButton() {
  const pathname = usePathname();

  if (pathname === '/') {
    return null;
  }

  return (
    <Link
      href="/"
      className="fixed right-4 top-4 z-50 text-[var(--text-muted)] transition hover:text-[var(--text-heading)] sm:right-6 sm:top-6"
      aria-label="메인페이지로 이동"
      title="메인페이지로 이동"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-5 w-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 10.75 12 3l9 7.75M5.25 9.5V20a.75.75 0 0 0 .75.75h4.5v-5.25a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 .75.75v5.25H18a.75.75 0 0 0 .75-.75V9.5"
        />
      </svg>
    </Link>
  );
}
