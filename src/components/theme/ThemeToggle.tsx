'use client';

import { useEffect, useState } from 'react';
import { FiMoon, FiSun } from 'react-icons/fi';

const STORAGE_KEY = 'portfolio-theme';
const THEME_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

type Theme = 'light' | 'dark';

type ThemeToggleProps = {
  initialTheme?: Theme;
};

function applyTheme(theme: Theme) {
  if (typeof document === 'undefined') {
    return;
  }

  const root = document.documentElement;
  root.dataset.theme = theme;
  root.style.colorScheme = theme === 'dark' ? 'dark' : 'light';
}

function saveTheme(theme: Theme) {
  try {
    window.localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // localStorage can be unavailable in private or restricted browser contexts.
  }

  document.cookie = `${STORAGE_KEY}=${theme}; path=/; max-age=${THEME_COOKIE_MAX_AGE}; samesite=lax`;
}

function getSavedTheme(): Theme | null {
  try {
    const savedTheme = window.localStorage.getItem(STORAGE_KEY);

    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }
  } catch {
    return null;
  }

  return null;
}

export default function ThemeToggle({ initialTheme = 'light' }: ThemeToggleProps) {
  const [theme, setTheme] = useState<Theme>(initialTheme);
  const [mounted, setMounted] = useState(false);
  const nextTheme = theme === 'dark' ? 'light' : 'dark';
  const Icon = theme === 'dark' ? FiMoon : FiSun;
  const label = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      const resolvedTheme = getSavedTheme() ?? initialTheme;

      applyTheme(resolvedTheme);
      saveTheme(resolvedTheme);
      setTheme(resolvedTheme);
      setMounted(true);
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [initialTheme]);

  function handleToggle() {
    applyTheme(nextTheme);
    saveTheme(nextTheme);
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
