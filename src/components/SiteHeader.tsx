'use client';

// 공통 헤더 껍데기: 섹션별 레이아웃이 넘겨준 메뉴와 반대편 링크를 같은 디자인으로 그립니다.
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';

import ThemeToggle from '@/components/theme/ThemeToggle';
import type { HeaderConfig, NavItem } from '@/data/navigation';

type SiteHeaderProps = HeaderConfig & {
  initialTheme?: 'light' | 'dark';
};

function NavLink({
  item,
  className,
  onClick,
  children,
}: {
  item: NavItem;
  className?: string;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  if (item.external) {
    return (
      <a className={className} href={item.href} target="_blank" rel="noopener noreferrer" onClick={onClick}>
        {children}
      </a>
    );
  }

  return (
    <Link className={className} href={item.href} onClick={onClick}>
      {children}
    </Link>
  );
}

export default function SiteHeader({
  brandHref,
  navItems,
  crossLink,
  initialTheme = 'light',
}: SiteHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const hasMenu = navItems.length > 0 || Boolean(crossLink);

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
      }
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMenuOpen]);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link href={brandHref} className="site-brand" onClick={closeMenu}>
          Changmin.dev
        </Link>

        {hasMenu ? (
          <nav className="site-nav" aria-label="Primary navigation">
            {navItems.map((item) => (
              <NavLink key={item.label} item={item}>
                {item.label}
                {item.external ? ' ↗' : null}
              </NavLink>
            ))}
            {crossLink ? (
              <NavLink className="site-nav__projects" item={crossLink}>
                {crossLink.label} →
              </NavLink>
            ) : null}
          </nav>
        ) : null}

        <div className="site-header__actions">
          <ThemeToggle initialTheme={initialTheme} />
          {hasMenu ? (
            <button
              type="button"
              className="site-menu-toggle"
              aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-navigation"
              onClick={() => setIsMenuOpen((current) => !current)}
            >
              {isMenuOpen ? (
                <FiX className="site-menu-toggle__icon" aria-hidden="true" focusable="false" />
              ) : (
                <FiMenu className="site-menu-toggle__icon" aria-hidden="true" focusable="false" />
              )}
            </button>
          ) : null}
        </div>

        {hasMenu && isMenuOpen ? (
          <nav id="mobile-navigation" className="site-mobile-menu" aria-label="Mobile navigation">
            {navItems.map((item) => (
              <NavLink key={item.label} item={item} onClick={closeMenu}>
                <span>{item.label}</span>
                {item.external ? <span aria-hidden="true">↗</span> : null}
              </NavLink>
            ))}
            {crossLink ? (
              <>
                <span className="site-mobile-menu__divider" aria-hidden="true" />
                <NavLink className="site-mobile-menu__archive" item={crossLink} onClick={closeMenu}>
                  <span>{crossLink.label}</span>
                  <span aria-hidden="true">→</span>
                </NavLink>
              </>
            ) : null}
          </nav>
        ) : null}
      </div>
    </header>
  );
}
