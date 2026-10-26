import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  STORAGE_KEY,
  ThemeContext,
  applyTheme,
  storedTheme,
} from './themeContext';

/**
 * Owns the light/dark theme. First visits use dark mode; once the visitor
 * picks a theme it is saved and wins over the OS. Other open tabs follow along.
 */
export default function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => storedTheme() ?? 'dark');

  // theme-init.js normally applied this already; repair the DOM if it did not run.
  useEffect(() => {
    if (document.documentElement.classList.contains('dark') !== (theme === 'dark')) applyTheme(theme);
  }, [theme]);

  const setTheme = useCallback((next) => {
    applyTheme(next);
    setThemeState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* storage blocked: the theme still applies for this visit */
    }
  }, []);

  useEffect(() => {
    const follow = (next) => {
      applyTheme(next);
      setThemeState(next);
    };

    const onStorage = (event) => {
      if (event.key === STORAGE_KEY || event.key === null) follow(storedTheme() ?? 'dark');
    };
    window.addEventListener('storage', onStorage);

    return () => {
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      toggleTheme: () => setTheme(theme === 'dark' ? 'light' : 'dark'),
    }),
    [theme, setTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
