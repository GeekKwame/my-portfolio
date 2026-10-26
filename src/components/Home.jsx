import { memo } from 'react';
import { PERSONAL_INFO, SOCIAL_LINKS } from '../config/constants';
import GlobeExperience from './GlobeExperience';

const Home = memo(function Home() {
  const github = SOCIAL_LINKS.find((link) => link.platform === 'GitHub');
  return (
    <section id="home" aria-label="Introduction" className="hero-plane relative overflow-hidden">
      <div className="shell relative pt-28 pb-10 sm:pt-32 lg:pt-36">
        <div className="hero-grid">
          <div className="hero-copy min-w-0">
            <p className="label text-rise flex items-center gap-2.5"><span className="h-1.5 w-1.5 rounded-full bg-signal" aria-hidden="true" />Software engineer · {PERSONAL_INFO.location}</p>
            <h1 className="hero-title text-rise">Blessing<br />Edmund<span className="text-accent">.</span></h1>
            <p className="hero-position text-rise">Thoughtful software.<br /><span className="text-ink-muted">Solid foundations.</span></p>
            <p className="text-rise mt-5 max-w-[43ch] text-base sm:text-lg leading-relaxed text-ink-soft">{PERSONAL_INFO.intro}</p>
            <p className="mt-5 text-sm text-ink-muted">Backend engineering <span className="mx-2 text-accent" aria-hidden="true">/</span> Cloud infrastructure</p>
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
        <div className="hero-footnote">
          <p>Built with care. Designed to hold up.</p>
          <a href="#work" className="inline-flex min-h-[44px] items-center gap-3">Explore the work <span aria-hidden="true">↓</span></a>
        </div>
      </div>
    </section>
  );
});
export default Home;
