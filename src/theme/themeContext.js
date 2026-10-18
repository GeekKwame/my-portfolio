import { createContext } from 'react';

/** Keep in sync with public/theme-init.js, which applies the theme before React loads. */
export const STORAGE_KEY = 'theme';

export const THEME_COLOR = { light: '#ffffff', dark: '#0a0a0a' };

export const ThemeContext = createContext(null);

const darkQuery = () => window.matchMedia('(prefers-color-scheme: dark)');

export function systemTheme() {
  return darkQuery().matches ? 'dark' : 'light';
}

/** The visitor's explicit choice, or null if they have never picked one. */
export function storedTheme() {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value === 'dark' || value === 'light' ? value : null;
  } catch {
    return null;
  }
}

export function watchSystemTheme(onChange) {
  const query = darkQuery();
  const listener = (event) => onChange(event.matches ? 'dark' : 'light');
  query.addEventListener('change', listener);
  return () => query.removeEventListener('change', listener);
}

/**
 * Swaps the palette in a single frame. Without the `theme-switching` class every
 * element with a colour transition would fade at its own speed.
 */
export function applyTheme(theme) {
  const root = document.documentElement;
  root.classList.add('theme-switching');
  root.classList.toggle('dark', theme === 'dark');
  root.style.colorScheme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLOR[theme]);
  window.getComputedStyle(root).getPropertyValue('color');
  requestAnimationFrame(() => root.classList.remove('theme-switching'));
}
