'use client';

// 공통 헤더: 모든 페이지 상단에 Engineering | Literature 두 그룹 메뉴를 보여주고, 현재 페이지 그룹과 섹션을 강조합니다.
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';

import ThemeToggle from '@/components/theme/ThemeToggle';
import { navGroups, type NavGroup, type NavItem } from '@/data/navigation';

type SiteHeaderProps = {
  initialTheme?: 'light' | 'dark';
};

function isUnderPath(pathname: string, path: string) {
  return pathname === path || pathname.startsWith(`${path}/`);
}

function getActiveGroup(pathname: string) {
  return navGroups.find((group) => group.paths.some((path) => isUnderPath(pathname, path)));
}

function getPath(href: string) {
  const index = href.indexOf('#');
  return index >= 0 ? href.slice(0, index) : href;
}

function getHash(href: string) {
  const index = href.indexOf('#');
  return index >= 0 ? href.slice(index + 1) : '';
}

// 현재 화면 가운데쯤 보이는 섹션 id를 추적해 헤더 메뉴 강조에 씁니다.
function useActiveSection(group: NavGroup | undefined, pathname: string) {
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    setActiveId('');

    if (!group) {
      return;
    }

    const sections = group.items
      .filter((item) => getPath(item.href) === pathname)
      .map((item) => getHash(item.href))
      .filter(Boolean)
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => Boolean(element));

    if (sections.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];

        if (visibleEntry) {
          setActiveId(visibleEntry.target.id);
        }
      },
      { rootMargin: '-35% 0px -55% 0px' },
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [group, pathname]);

  return activeId;
}

function NavLink({
  item,
  isCurrent,
  onClick,
  children,
}: {
  item: NavItem;
  isCurrent?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  if (item.external) {
    return (
      <a href={item.href} target="_blank" rel="noopener noreferrer" onClick={onClick}>
        {children}
      </a>
    );
  }

  return (
    <Link href={item.href} aria-current={isCurrent ? 'location' : undefined} onClick={onClick}>
      {children}
    </Link>
  );
}

export default function SiteHeader({ initialTheme = 'light' }: SiteHeaderProps) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const activeGroup = getActiveGroup(pathname);
  const activeSectionId = useActiveSection(activeGroup, pathname);

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

  // 다른 그룹 페이지에 있을 때는 반대편 그룹을 옅게 표시합니다. (랜딩에서는 둘 다 같은 진하기)
  function groupClassName(base: string, group: NavGroup) {
    const isMuted = Boolean(activeGroup) && activeGroup?.key !== group.key;
    return isMuted ? `${base} ${base}--muted` : base;
  }

  // 섹션 링크(#)는 화면에 보이는 섹션과, 페이지 링크(예: /archive)는 현재 경로와 비교합니다.
  function isCurrentItem(group: NavGroup, item: NavItem) {
    if (activeGroup?.key !== group.key || item.external) {
      return false;
    }

    const hash = getHash(item.href);

    if (!hash) {
      return isUnderPath(pathname, item.href);
    }

    return activeSectionId !== '' && hash === activeSectionId;
  }

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link href="/" className="site-brand" onClick={closeMenu}>
          Changmin.dev
        </Link>

        <nav className="site-nav" aria-label="Primary navigation">
          {navGroups.map((group) => (
            <div
              key={group.key}
              className={groupClassName('site-nav__group', group)}
              role="group"
              aria-label={group.label}
            >
              {group.items.map((item) => (
                <NavLink key={item.label} item={item} isCurrent={isCurrentItem(group, item)}>
                  {item.label}
                  {item.external ? ' ↗' : null}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <div className="site-header__actions">
          <ThemeToggle initialTheme={initialTheme} />
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
            {navGroups.map((group, index) => (
              <div key={group.key} className={groupClassName('site-mobile-menu__group', group)}>
                {index > 0 ? <span className="site-mobile-menu__divider" aria-hidden="true" /> : null}
                {group.items.map((item) => (
                  <NavLink
                    key={item.label}
                    item={item}
                    isCurrent={isCurrentItem(group, item)}
                    onClick={closeMenu}
                  >
                    <span>{item.label}</span>
                    {item.external ? <span aria-hidden="true">↗</span> : null}
                  </NavLink>
                ))}
              </div>
            ))}
          </nav>
        ) : null}
      </div>
    </header>
  );
}
