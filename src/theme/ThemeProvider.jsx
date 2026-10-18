import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import {
  STORAGE_KEY,
  ThemeContext,
  applyTheme,
  storedTheme,
  systemTheme,
  watchSystemTheme,
} from './themeContext';

/**
 * Owns the light/dark theme. First visits follow the OS setting; once the visitor
 * picks a theme it is saved and wins over the OS. Other open tabs follow along.
 */
export default function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => storedTheme() ?? systemTheme());

  // theme-init.js normally applied this already; repair the DOM if it did not run.
  useLayoutEffect(() => {
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

    const stopWatching = watchSystemTheme((next) => {
      if (!storedTheme()) follow(next);
    });

    const onStorage = (event) => {
      if (event.key === STORAGE_KEY || event.key === null) follow(storedTheme() ?? systemTheme());
    };
    window.addEventListener('storage', onStorage);

    return () => {
      stopWatching();
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
