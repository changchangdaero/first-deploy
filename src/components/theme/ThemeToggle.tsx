'use client';

import { useEffect, useState } from 'react';

const STORAGE_KEY = 'portfolio-theme';

type Theme = 'light' | 'dark';

function getResolvedTheme(): Theme {
  if (typeof document === 'undefined') {
    return 'light';
  }

  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.style.colorScheme = theme === 'dark' ? 'dark' : 'light';
  window.localStorage.setItem(STORAGE_KEY, theme);
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('light');
  const nextTheme = theme === 'dark' ? 'light' : 'dark';

  useEffect(() => {
    setTheme(getResolvedTheme());
  }, []);

  function handleToggle() {
    const updatedTheme = nextTheme;
    applyTheme(updatedTheme);
    setTheme(updatedTheme);
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      className="link-pill min-w-[108px]"
      aria-label={`테마 전환: ${nextTheme === 'dark' ? '다크 모드' : '라이트 모드'}`}
      title={`테마 전환: ${nextTheme === 'dark' ? '다크 모드' : '라이트 모드'}`}
    >
      <span aria-hidden="true" className="mr-2 text-sm">
        {theme === 'dark' ? '🌙' : '☀'}
      </span>
      {theme === 'dark' ? '라이트 모드' : '다크 모드'}
    </button>
  );
}
