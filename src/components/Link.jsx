import { forwardRef } from 'react';
import { currentPath, navigate, normalizePath } from '../routing/navigation';

/**
 * Internal link. Changing page goes through `navigate` so the theme, scroll
 * position, and app state survive; same-page hash links keep native behaviour.
 */
const Link = forwardRef(function Link({ to, onClick, children, ...props }, ref) {
  const handleClick = (event) => {
    onClick?.(event);
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    const url = new URL(to, window.location.href);
    if (url.origin !== window.location.origin) return;
    if (normalizePath(url.pathname) === currentPath() && url.hash) return;

    event.preventDefault();
    navigate(to);
  };

  return (
    <a ref={ref} href={to} onClick={handleClick} {...props}>
      {children}
    </a>
  );
});

export default Link;
