'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';

import ThemeToggle from '@/components/theme/ThemeToggle';

const sectionNavItems = [
  { label: 'About', href: '/#about' },
  { label: 'Tech Stack', href: '/#tech-stack' },
  { label: 'Writing', href: '/#writing' },
  { label: 'Contact', href: '/#contact' },
];

const archiveNavItem = { label: 'Archive', href: '/archive' };

export default function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link href="/#home" className="site-brand" onClick={() => setIsMenuOpen(false)}>
          Changmin.dev
        </Link>

        <nav className="site-nav" aria-label="Primary navigation">
          {sectionNavItems.map((item) => (
            <Link key={item.label} href={item.href}>
              {item.label}
            </Link>
          ))}
          <Link className="site-nav__archive" href={archiveNavItem.href}>
            {archiveNavItem.label}
          </Link>
        </nav>

        <div className="site-header__actions">
          <ThemeToggle />
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
        </div>

        {isMenuOpen ? (
          <nav id="mobile-navigation" className="site-mobile-menu" aria-label="Mobile navigation">
            {sectionNavItems.map((item) => (
              <Link key={item.label} href={item.href} onClick={() => setIsMenuOpen(false)}>
                {item.label}
              </Link>
            ))}
            <span className="site-mobile-menu__divider" aria-hidden="true" />
            <Link
              className="site-mobile-menu__archive"
              href={archiveNavItem.href}
              onClick={() => setIsMenuOpen(false)}
            >
              <span>{archiveNavItem.label}</span>
              <span aria-hidden="true">→</span>
            </Link>
          </nav>
        ) : null}
      </div>
    </header>
  );
}
