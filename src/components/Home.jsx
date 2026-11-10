import { memo } from 'react';
import { PERSONAL_INFO, RESUME } from '../config/constants';
import { trackResumeDownload, trackSocialClick } from '../utils/analytics';
import GlobeExperience from './GlobeExperience';

const Home = memo(function Home() {
  return (
    <section id="home" aria-label="Introduction" className="hero-plane relative overflow-hidden">
      <div className="shell relative pt-28 pb-10 sm:pt-32 lg:pt-36">
        <div className="hero-grid">
          <div className="hero-copy min-w-0">
            <p className="label text-rise flex items-center gap-2.5"><span className="h-1.5 w-1.5 rounded-full bg-signal" aria-hidden="true" />Blessing Edmund · Software engineer · {PERSONAL_INFO.location}</p>
            <h1 className="hero-title text-rise">I build software that works in the real world<span className="text-accent">.</span></h1>
            <p className="text-rise mt-6 max-w-[57ch] text-base sm:text-lg leading-relaxed text-ink-soft">{PERSONAL_INFO.intro}</p>
            <p className="mt-5 text-sm text-ink-muted">
              Backend &amp; cloud <span className="mx-2 text-accent" aria-hidden="true">/</span> Web applications <span className="mx-2 text-accent" aria-hidden="true">/</span> Data &amp; GIS
            </p>
            <div className="text-rise mt-8 flex flex-wrap gap-3">
              <a
                href={RESUME.path}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackResumeDownload()}
                className="btn-primary"
                aria-label="View résumé, PDF (opens in a new tab)"
              >
                View résumé <span aria-hidden="true">↗</span>
              </a>
              <a
                href={`mailto:${PERSONAL_INFO.email}?subject=${encodeURIComponent('Project enquiry')}`}
                onClick={() => trackSocialClick('hero_project_enquiry')}
                className="btn-secondary"
              >
                Discuss a project <span aria-hidden="true">→</span>
              </a>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
              <a href="#work" className="link inline-flex min-h-[44px] items-center">Explore selected work <span className="ml-2" aria-hidden="true">↓</span></a>
              <span className="text-ink-muted">Open to roles, contracts, and selected freelance work</span>
            </div>
          </div>
          <GlobeExperience />
        </div>
        <div className="hero-footnote">
          <p>Source-linked case studies</p>
          <p>Built, tested, and documented.</p>
        </div>
      </div>
    </section>
  );
});
export default Home;
