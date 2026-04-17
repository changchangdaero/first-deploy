'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import ThemeToggle from '@/components/theme/ThemeToggle';

export default function SiteHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const isHome = pathname === '/';

  function handleBack() {
    if (window.history.length > 1) {
      router.back();
      return;
    }

    router.push('/');
  }

  return (
    <header className="site-header">
      <div className="site-header__left">
        {!isHome && (
          <button
            type="button"
            onClick={handleBack}
            className="link-pill"
            aria-label="뒤로가기"
            title="뒤로가기"
          >
            뒤로가기
          </button>
        )}
      </div>

      <div className="site-header__right">
        {!isHome && (
          <Link
            href="/"
            className="link-pill"
            aria-label="홈으로 이동"
            title="홈으로 이동"
          >
            홈
          </Link>
        )}
        <ThemeToggle />
      </div>
    </header>
  );
}
