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
    /* storage blocked: use the default dark palette */
  }
  var theme = stored === 'dark' || stored === 'light'
    ? stored
    : 'dark';

  root.classList.toggle('dark', theme === 'dark');
  root.style.colorScheme = theme;

  var meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', theme === 'dark' ? '#0a1014' : '#ffffff');
})();
