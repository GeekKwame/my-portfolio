/**
 * Minimal client-side routing for a two-page site, without a router dependency.
 * Every route must also be rewritten to index.html by the host (vercel.json, netlify.toml).
 */

const NAVIGATE_EVENT = 'app:navigate';

export const ROUTES = {
  home: '/',
  projects: '/projects',
};

export function normalizePath(pathname) {
  const trimmed = pathname.replace(/\/+$/, '');
  return trimmed === '' ? '/' : trimmed;
}

export function currentPath() {
  return normalizePath(window.location.pathname);
}

export function onNavigate(listener) {
  window.addEventListener('popstate', listener);
  window.addEventListener(NAVIGATE_EVENT, listener);
  return () => {
    window.removeEventListener('popstate', listener);
    window.removeEventListener(NAVIGATE_EVENT, listener);
  };
}

/** Scrolls to the URL hash once the new page has rendered, or to the top if there is none. */
export function scrollToHash(hash, attempts = 10) {
  if (!hash) {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    return;
  }
  const target = document.getElementById(decodeURIComponent(hash.slice(1)));
  if (target) {
    target.scrollIntoView({ block: 'start' });
    return;
  }
  if (attempts > 0) requestAnimationFrame(() => scrollToHash(hash, attempts - 1));
}

export function navigate(to) {
  const url = new URL(to, window.location.href);
  window.history.pushState({}, '', `${url.pathname}${url.search}${url.hash}`);
  window.dispatchEvent(new Event(NAVIGATE_EVENT));
  requestAnimationFrame(() => scrollToHash(url.hash));
}
