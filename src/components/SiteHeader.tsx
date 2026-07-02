'use client';

// 사이트 헤더: 모든 페이지에 보이는 고정 내비게이션, 뒤로가기 동작, 테마 전환을 담당합니다.
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import ThemeToggle from '@/components/theme/ThemeToggle';

const navItems = [
  { label: 'Home', href: '/#home' },
  { label: 'Projects', href: '/projects' },
  { label: 'Archive', href: '/archive' },
  { label: 'Writing', href: '/writing' },
  { label: 'Contact', href: '/contact' },
];

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
      <div className="site-header__inner">
        <Link href="/#home" className="site-brand">
          Changmin.dev
        </Link>

        <nav className="site-nav" aria-label="주요 내비게이션">
          {navItems.map((item) => (
            <Link key={item.label} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="site-header__actions">
          {!isHome && (
            <button
              type="button"
              onClick={handleBack}
              className="link-pill"
              aria-label="이전 페이지로 이동"
              title="이전 페이지로 이동"
            >
              Back
            </button>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
