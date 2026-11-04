import { memo } from 'react';
import { PERSONAL_INFO, PORTFOLIO_TELEMETRY, SOCIAL_LINKS } from '../config/constants';
import GlobeExperience from './GlobeExperience';
import Link from './Link';

const Home = memo(function Home() {
  const github = SOCIAL_LINKS.find((link) => link.platform === 'GitHub');
  return (
    <section id="home" aria-label="Introduction" className="hero-plane relative overflow-hidden">
      <div className="shell relative pt-28 pb-12 sm:pt-32 lg:pt-36">
        <div className="hero-grid">
          <div className="hero-copy min-w-0">
            <p className="label text-rise flex flex-wrap items-center gap-2.5">
              <span className="h-1.5 w-1.5 rounded-full bg-signal" aria-hidden="true" />
              <span>Software engineer · {PERSONAL_INFO.location}</span>
              <span aria-hidden="true" className="text-ink-faint">·</span>
              <span className="font-mono text-[0.7rem] text-accent-strong">UTC+0 / GMT</span>
            </p>
            <h1 className="hero-title text-rise">Blessing<br />Edmund<span className="text-accent">.</span></h1>
            <p className="hero-position text-rise">Thoughtful software.<br /><span className="text-ink-muted">Solid foundations.</span></p>
            <p className="text-rise mt-5 max-w-[44ch] text-base sm:text-lg leading-relaxed text-ink-soft">{PERSONAL_INFO.intro}</p>
            <p className="mt-5 font-mono text-xs sm:text-sm text-ink-muted">
              Backend engineering <span className="mx-1.5 text-accent" aria-hidden="true">/</span> Cloud infrastructure <span className="mx-1.5 text-accent" aria-hidden="true">/</span> Geospatial systems
            </p>
            <div className="text-rise mt-8 flex flex-wrap gap-3">
              <a href="#work" className="btn-primary">Explore projects <span aria-hidden="true">↘</span></a>
              <a href={github.url} target="_blank" rel="noopener noreferrer" className="btn-secondary" aria-label="View GitHub (opens in a new tab)">View GitHub <span aria-hidden="true">↗</span></a>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
              <a href="#contact" className="link inline-flex min-h-[44px] items-center">Let’s work together <span className="ml-2" aria-hidden="true">→</span></a>
              <span className="text-ink-muted">Open to new roles</span>
            </div>
          </div>
          <GlobeExperience />
        </div>

        {/* Verified Engineering Proof Strip */}
        <ul aria-label="Engineering portfolio highlights" className="mt-12 grid gap-4 border-t border-rule pt-8 sm:grid-cols-2 lg:grid-cols-4">
          {PORTFOLIO_TELEMETRY.map((item) => (
            <li
              key={item.label}
              className="group relative flex flex-col justify-between rounded-xl border border-rule bg-paper-raised p-4 transition-colors hover:border-ink/40"
            >
              <div>
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-display text-2xl sm:text-[1.75rem] leading-none text-ink">{item.metric}</span>
                  <span className="font-mono text-[0.6875rem] uppercase tracking-[0.06em] text-accent-strong">{item.unit}</span>
                </div>
                <p className="mt-2 font-sans text-sm font-semibold text-ink">{item.label}</p>
                <p className="mt-1 text-xs leading-relaxed text-ink-muted">{item.detail}</p>
              </div>
              <div className="mt-3 pt-2 border-t border-rule/70">
                <Link to={item.href} className="inline-flex items-center gap-1.5 font-mono text-[0.6875rem] font-medium text-ink-muted group-hover:text-ink">
                  Inspect evidence <span aria-hidden="true">→</span>
                </Link>
              </div>
            </li>
          ))}
        </ul>

        <div className="hero-footnote">
          <p>Built with care. Designed to hold up.</p>
          <a href="#work" className="inline-flex min-h-[44px] items-center gap-3">Explore the work <span aria-hidden="true">↓</span></a>
        </div>
      </div>
    </section>
  );
});
export default Home;
