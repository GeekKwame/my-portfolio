import { useState, useEffect, useRef, useCallback } from 'react';
import { PERSONAL_INFO, NAVIGATION_LINKS, RESUME, SOCIAL_LINKS } from '../config/constants';
import { trackResumeDownload, trackSocialClick } from '../utils/analytics';
import { ROUTES } from '../routing/navigation';
import ThemeToggle from './ThemeToggle';
import Link from './Link';

const SECTION_IDS = NAVIGATION_LINKS.filter((l) => l.section).map((l) => l.section);

function useActiveSection(path) {
  const [state, setState] = useState({ path, id: '' });

  useEffect(() => {
    if (path !== ROUTES.home) return undefined;
    const setActive = (id) => setState({ path, id });

    const sections = SECTION_IDS.map((id) => document.getElementById(id)).filter(Boolean);
    if (!sections.length) return undefined;

    // A section is "active" while it crosses a thin band just below the header.
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-20% 0px -75% 0px' }
    );
    sections.forEach((s) => observer.observe(s));

    const onScroll = () => {
      if (window.scrollY < window.innerHeight * 0.5) setActive('');
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, [path]);

  return state.path === path ? state.id : '';
}

/** Hides the header while scrolling down the page and brings it back on any upward scroll. */
function useHideOnScroll() {
  const [state, setState] = useState(() => ({ scrolled: typeof window !== 'undefined' && window.scrollY > 8, hidden: false }));

  useEffect(() => {
    let lastY = window.scrollY;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const y = window.scrollY;
        const delta = y - lastY;
        if (Math.abs(delta) < 4) return;
        setState({ scrolled: y > 8, hidden: delta > 0 && y > 160 });
        lastY = y;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return state;
}

function NavBar({ path }) {
  // Remembering which page the menu was opened on closes it after navigating.
  const [openOn, setOpenOn] = useState(null);
  const open = openOn === path;
  const setOpen = (value) => setOpenOn(value ? path : null);
  const { scrolled, hidden } = useHideOnScroll();
  const active = useActiveSection(path);
  const menuButtonRef = useRef(null);
  const firstLinkRef = useRef(null);

  const isCurrent = (link) => (link.route ? path === link.route : path === ROUTES.home && active === link.section);

  const close = useCallback((restoreFocus = true) => {
    setOpenOn(null);
    if (restoreFocus) requestAnimationFrame(() => menuButtonRef.current?.focus());
  }, []);

  // While the menu is open: lock scroll, make the page behind it inert, close on Escape.
  useEffect(() => {
    if (!open) return undefined;
    const background = [...document.querySelectorAll('#main, footer, [data-menu-inert]')];
    background.forEach((el) => el.setAttribute('inert', ''));
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => firstLinkRef.current?.focus());

    const onKey = (e) => { if (e.key === 'Escape') close(); };
    const onResize = () => { if (window.innerWidth >= 1024) close(false); };
    window.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);

    return () => {
      background.forEach((el) => el.removeAttribute('inert'));
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
    };
  }, [open, close]);

  const github = SOCIAL_LINKS.find((l) => l.platform === 'GitHub');
  const linkedin = SOCIAL_LINKS.find((l) => l.platform === 'LinkedIn');

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b bg-paper/90 backdrop-blur-md transition-[transform,border-color] duration-300
        focus-within:translate-y-0 ${scrolled || open ? 'border-rule' : 'border-transparent'} ${hidden && !open ? '-translate-y-full' : 'translate-y-0'}`}
    >
      <div className="shell flex h-16 items-center justify-between gap-6">
        <Link
          to={ROUTES.home}
          className="inline-flex min-h-[44px] items-center font-display text-[1.75rem] leading-none text-ink transition-opacity hover:opacity-70"
        >
          {PERSONAL_INFO.initials}
          <span className="sr-only">, {PERSONAL_INFO.name}, home</span>
        </Link>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {NAVIGATION_LINKS.map((link) => {
              const current = isCurrent(link);
              return (
                <li key={link.id}>
                  <Link
                    to={link.href}
                    aria-current={current ? (link.route ? 'page' : 'location') : undefined}
                    className={`relative inline-flex min-h-[44px] items-center px-3 text-[0.9375rem] transition-colors ${
                      current ? 'text-ink' : 'text-ink-muted hover:text-ink'
                    }`}
                  >
                    {link.name}
                    <span
                      aria-hidden="true"
                      className={`absolute inset-x-3 bottom-2 h-px origin-left bg-accent transition-transform duration-200 ${
                        current ? 'scale-x-100' : 'scale-x-0'
                      }`}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={RESUME.path}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackResumeDownload()}
            className="hidden sm:inline-flex btn-secondary !min-h-[40px] !px-4 !text-sm"
            aria-label="Resume, PDF (opens in a new tab)"
          >
            Resume <span aria-hidden="true">↗</span>
          </a>

          <ThemeToggle />

          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => (open ? close() : setOpen(true))}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="lg:hidden inline-flex items-center gap-2.5 min-h-[44px] px-3 -mr-3 text-[0.9375rem] text-ink"
          >
            {open ? 'Close' : 'Menu'}
            <span aria-hidden="true" className="relative block h-2.5 w-4">
              <span className={`absolute left-0 top-0 h-px w-4 bg-ink transition-transform duration-200 ${open ? 'translate-y-[5px] rotate-45' : ''}`} />
              <span className={`absolute left-0 bottom-0 h-px w-4 bg-ink transition-transform duration-200 ${open ? '-translate-y-[4px] -rotate-45' : ''}`} />
            </span>
          </button>
        </div>
      </div>

      {open && (
        <div id="mobile-menu" className="lg:hidden fixed inset-x-0 top-16 bottom-0 h-[calc(100dvh-4rem)] overflow-y-auto bg-paper border-t border-rule">
          <nav aria-label="Site menu" className="shell py-6">
            <ol>
              {NAVIGATION_LINKS.map((link, i) => {
                const current = isCurrent(link);
                return (
                  <li key={link.id} className="border-b border-rule">
                    <Link
                      ref={i === 0 ? firstLinkRef : undefined}
                      to={link.href}
                      onClick={() => close(false)}
                      aria-current={current ? (link.route ? 'page' : 'location') : undefined}
                      className="flex items-baseline gap-4 py-4"
                    >
                      <span className="font-mono text-meta text-accent-strong">{String(i + 1).padStart(2, '0')}</span>
                      <span className={`font-sans font-black tracking-[-0.03em] text-[2rem] leading-tight ${current ? 'text-ink-muted' : 'text-ink'}`}>
                        {link.name}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ol>

            <ul className="mt-8 space-y-1 text-[0.9375rem]">
              <li>
                <a href={RESUME.path} target="_blank" rel="noopener noreferrer"
                  onClick={() => { trackResumeDownload(); close(false); }}
                  className="flex min-h-[44px] items-center justify-between text-ink">
                  Resume (PDF) <span aria-hidden="true" className="text-ink-muted">↗</span>
                </a>
              </li>
              <li>
                <a href={github.url} target="_blank" rel="noopener noreferrer" onClick={() => trackSocialClick('github_menu')}
                  className="flex min-h-[44px] items-center justify-between text-ink">
                  GitHub <span aria-hidden="true" className="text-ink-muted">↗</span>
                </a>
              </li>
              <li>
                <a href={linkedin.url} target="_blank" rel="noopener noreferrer" onClick={() => trackSocialClick('linkedin_menu')}
                  className="flex min-h-[44px] items-center justify-between text-ink">
                  LinkedIn <span aria-hidden="true" className="text-ink-muted">↗</span>
                </a>
              </li>
              <li>
                <a href={`mailto:${PERSONAL_INFO.email}`} className="flex min-h-[44px] items-center text-ink-muted break-all">
                  {PERSONAL_INFO.email}
                </a>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
}

export default NavBar;
