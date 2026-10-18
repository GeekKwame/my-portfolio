/*
 * Runs before first paint, so the page never flashes the wrong theme.
 * Loaded as an external file because the Content-Security-Policy blocks inline scripts.
 * Keep the storage key and colours in sync with src/theme/themeContext.js.
 */
(function () {
  var root = document.documentElement;
  var stored = null;
  try {
    stored = localStorage.getItem('theme');
  } catch {
    /* storage blocked: fall back to the OS preference */
  }
  var theme = stored === 'dark' || stored === 'light'
    ? stored
    : window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

  root.classList.toggle('dark', theme === 'dark');
  root.style.colorScheme = theme;

  var meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', theme === 'dark' ? '#0a0a0a' : '#ffffff');
})();
