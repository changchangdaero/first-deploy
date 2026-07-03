'use client';

import { useEffect, useState } from 'react';
import { FiMoon, FiSun } from 'react-icons/fi';

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
  const [mounted, setMounted] = useState(false);
  const nextTheme = theme === 'dark' ? 'light' : 'dark';
  const Icon = theme === 'dark' ? FiMoon : FiSun;
  const label = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';

  useEffect(() => {
    setTheme(getResolvedTheme());
    setMounted(true);
  }, []);

  function handleToggle() {
    applyTheme(nextTheme);
    setTheme(nextTheme);
  }

  return (
    <button type="button" onClick={handleToggle} className="theme-toggle" aria-label={label} title={label}>
      {mounted ? (
        <Icon className="theme-toggle__icon" aria-hidden="true" focusable="false" />
      ) : (
        <span className="theme-toggle__placeholder" aria-hidden="true" />
      )}
    </button>
  );
}
