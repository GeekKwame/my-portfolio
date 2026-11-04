import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FaTimes, FaSearch } from 'react-icons/fa';
import { ENGINEERING_WAYPOINTS, PERSONAL_INFO, RESUME, SECTION_INDEX, SOCIAL_LINKS } from '../config/constants';
import { PROJECTS, projectHref } from '../data/projects';
import { OPEN_COMMAND_PALETTE_EVENT, ROUTES, navigate, scrollToHash } from '../routing/navigation';
import useTheme from '../hooks/useTheme';
import { useToastContext } from '../context/ToastContext';

export default function CommandPalette({ path }) {
  const dialogRef = useRef(null);
  const inputRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const { theme, toggleTheme } = useTheme();
  const { success } = useToastContext();

  const close = useCallback(() => {
    setIsOpen(false);
    setQuery('');
    if (dialogRef.current?.open) dialogRef.current.close();
  }, []);

  const open = useCallback(() => {
    setIsOpen(true);
    setQuery('');
    setActiveIndex(0);
    if (dialogRef.current && !dialogRef.current.open) {
      dialogRef.current.showModal();
    }
    requestAnimationFrame(() => inputRef.current?.focus());
  }, []);

  useEffect(() => {
    const onKeyDown = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        if (dialogRef.current?.open) close();
        else open();
      }
    };
    const onCustomOpen = () => open();
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener(OPEN_COMMAND_PALETTE_EVENT, onCustomOpen);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener(OPEN_COMMAND_PALETTE_EVENT, onCustomOpen);
    };
  }, [open, close]);

  const items = useMemo(() => {
    const github = SOCIAL_LINKS.find((l) => l.platform === 'GitHub');
    const linkedin = SOCIAL_LINKS.find((l) => l.platform === 'LinkedIn');

    const projectItems = PROJECTS.map((p) => ({
      id: `proj-${p.slug}`,
      group: 'Projects & Case Studies',
      title: p.title,
      meta: `${p.category} · ${p.stack.slice(0, 4).join(', ')}`,
      keywords: `${p.title} ${p.shortTitle} ${p.category} ${p.stack.join(' ')} ${p.summary}`.toLowerCase(),
      kind: 'navigate',
      target: projectHref(p.slug),
    }));

    const waypointItems = ENGINEERING_WAYPOINTS.map((wp) => ({
      id: `wp-${wp.id}`,
      group: 'Earth Waypoints (3D Globe)',
      title: `Fly Earth to ${wp.shortLabel}`,
      meta: wp.coords,
      keywords: `globe earth fly waypoint ${wp.title} ${wp.shortLabel} ${wp.role} ${wp.stack}`.toLowerCase(),
      kind: 'waypoint',
      target: wp.id,
    }));

    const navItems = [
      ...SECTION_INDEX.map((sec) => ({
        id: `sec-${sec.to}`,
        group: 'Navigation',
        title: `${sec.number} / ${sec.name}`,
        meta: 'Homepage section',
        keywords: `section ${sec.name} ${sec.number}`.toLowerCase(),
        kind: 'section',
        target: sec.to,
      })),
      {
        id: 'route-projects',
        group: 'Navigation',
        title: 'Browse All 13 Projects & Case Studies',
        meta: '/projects',
        keywords: 'projects all case studies archive filter',
        kind: 'navigate',
        target: ROUTES.projects,
      },
    ];

    const quickActions = [
      {
        id: 'act-copy-email',
        group: 'Quick Actions',
        title: `Copy Email (${PERSONAL_INFO.email})`,
        meta: 'Clipboard',
        keywords: 'email contact copy message hire',
        kind: 'copy-email',
      },
      {
        id: 'act-theme',
        group: 'Quick Actions',
        title: `Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Theme`,
        meta: `Current: ${theme}`,
        keywords: 'theme dark light mode toggle appearance',
        kind: 'theme',
      },
      {
        id: 'act-resume',
        group: 'Quick Actions',
        title: 'Open Resume (PDF)',
        meta: 'New tab',
        keywords: 'resume cv pdf download',
        kind: 'external',
        target: RESUME.path,
      },
      {
        id: 'act-github',
        group: 'Quick Actions',
        title: `Open GitHub (${github.handle})`,
        meta: 'External',
        keywords: 'github source code repositories',
        kind: 'external',
        target: github.url,
      },
      {
        id: 'act-linkedin',
        group: 'Quick Actions',
        title: `Open LinkedIn (${linkedin.handle})`,
        meta: 'External',
        keywords: 'linkedin social profile',
        kind: 'external',
        target: linkedin.url,
      },
    ];

    return [...quickActions, ...waypointItems, ...navItems, ...projectItems];
  }, [theme]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) => item.keywords.includes(q) || item.title.toLowerCase().includes(q));
  }, [items, query]);

  const safeIndex = filtered.length > 0 ? Math.min(activeIndex, filtered.length - 1) : 0;

  const executeItem = async (item) => {
    if (!item) return;
    close();
    if (item.kind === 'navigate') {
      navigate(item.target);
    } else if (item.kind === 'section') {
      if (path === ROUTES.home) scrollToHash(`#${item.target}`);
      else navigate(`/#${item.target}`);
    } else if (item.kind === 'waypoint') {
      if (path !== ROUTES.home) {
        navigate(ROUTES.home);
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('globe:focus-waypoint', { detail: { waypointId: item.target } }));
        }, 250);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        window.dispatchEvent(new CustomEvent('globe:focus-waypoint', { detail: { waypointId: item.target } }));
      }
    } else if (item.kind === 'copy-email') {
      try {
        await navigator.clipboard.writeText(PERSONAL_INFO.email);
        success('Email address copied');
      } catch {
        window.location.href = `mailto:${PERSONAL_INFO.email}`;
      }
    } else if (item.kind === 'theme') {
      toggleTheme();
    } else if (item.kind === 'external') {
      window.open(item.target, '_blank', 'noopener,noreferrer');
    }
  };

  const onInputKeyDown = (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (filtered.length > 0) setActiveIndex((i) => (i + 1) % filtered.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (filtered.length > 0) setActiveIndex((i) => (i - 1 + filtered.length) % filtered.length);
    } else if (event.key === 'Enter' && filtered[safeIndex]) {
      event.preventDefault();
      executeItem(filtered[safeIndex]);
    }
  };

  return (
    <dialog
      ref={dialogRef}
      onClose={() => setIsOpen(false)}
      onClick={(e) => { if (e.target === dialogRef.current) close(); }}
      aria-label="Engineering command palette"
      className="m-auto w-[min(94vw,42rem)] rounded-2xl border border-rule-strong bg-paper p-0 text-ink shadow-2xl"
    >
      {isOpen && (
        <div className="flex max-h-[82vh] flex-col">
          <div className="flex items-center gap-3 border-b border-rule px-4 py-3.5 sm:px-5">
            <FaSearch size={14} className="text-ink-muted shrink-0" aria-hidden="true" />
            <label htmlFor="command-palette-input" className="sr-only">
              Search projects, technologies, globe waypoints, or actions
            </label>
            <input
              ref={inputRef}
              id="command-palette-input"
              type="text"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setActiveIndex(0); }}
              onKeyDown={onInputKeyDown}
              placeholder="Search 13 projects, stack (Terraform, FastAPI, QGIS), or actions…"
              className="w-full bg-transparent font-sans text-sm sm:text-base text-ink placeholder:text-ink-muted focus:outline-none"
            />
            <button
              type="button"
              onClick={close}
              aria-label="Close command palette"
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-rule text-ink-muted hover:border-ink/40 hover:text-ink"
            >
              <FaTimes size={12} aria-hidden="true" />
            </button>
          </div>

          <div className="overflow-y-auto p-3 sm:p-4" role="listbox" aria-label="Command results">
            {filtered.length === 0 ? (
              <p className="py-8 text-center text-sm text-ink-muted">
                No matching projects, technologies, or actions for &ldquo;{query}&rdquo;.
              </p>
            ) : (
              <ul className="space-y-1">
                {filtered.map((item, idx) => {
                  const selected = idx === safeIndex;
                  const showGroup = idx === 0 || filtered[idx - 1].group !== item.group;
                  return (
                    <li key={item.id}>
                      {showGroup && (
                        <p className="px-3 pt-3 pb-1.5 font-mono text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-accent-strong">
                          {item.group}
                        </p>
                      )}
                      <button
                        type="button"
                        role="option"
                        aria-selected={selected}
                        onMouseEnter={() => setActiveIndex(idx)}
                        onClick={() => executeItem(item)}
                        className={`flex w-full items-center justify-between gap-4 rounded-xl px-3 py-2.5 text-left transition-colors ${
                          selected ? 'bg-ink text-paper' : 'text-ink hover:bg-paper-sunk'
                        }`}
                      >
                        <span className="font-sans text-sm font-medium">{item.title}</span>
                        <span className={`font-mono text-xs shrink-0 ${selected ? 'text-paper/80' : 'text-ink-muted'}`}>
                          {item.meta}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-rule bg-paper-sunk/60 px-4 py-2.5 font-mono text-[0.6875rem] text-ink-muted">
            <span>↑↓ Navigate · ↵ Select · Esc Close</span>
            <span>Shortcut: ⌘K / Ctrl+K</span>
          </div>
        </div>
      )}
    </dialog>
  );
}
