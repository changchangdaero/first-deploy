'use client';

// 테마 전환 버튼: 헤더에서 포트폴리오 전체를 밝은/어두운 테마로 바꿉니다.
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
    applyTheme(nextTheme);
    setTheme(nextTheme);
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      className="link-pill theme-toggle"
      aria-label={`${nextTheme === 'dark' ? '어두운' : '밝은'} 테마로 전환`}
      title={`${nextTheme === 'dark' ? '어두운' : '밝은'} 테마로 전환`}
    >
      {theme === 'dark' ? 'Light' : 'Dark'}
    </button>
  );
}
