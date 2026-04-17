const themeScript = `
(() => {
  const storageKey = 'portfolio-theme';
  const root = document.documentElement;

  const applyTheme = (theme) => {
    root.dataset.theme = theme;
    root.style.colorScheme = theme === 'dark' ? 'dark' : 'light';
  };

  try {
    const savedTheme = window.localStorage.getItem(storageKey);

    if (savedTheme === 'light' || savedTheme === 'dark') {
      applyTheme(savedTheme);
      return;
    }
  } catch {}

  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(prefersDark ? 'dark' : 'light');
})();
`;

export default function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: themeScript }} />;
}
