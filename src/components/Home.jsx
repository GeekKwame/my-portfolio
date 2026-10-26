import { lazy, memo, Suspense } from 'react';
import { PERSONAL_INFO } from '../config/constants';
import { ROUTES } from '../routing/navigation';
import SocialIcons from './SocialIcons';
import Link from './Link';

const HeroGlobe = lazy(() => import('./HeroGlobe'));

const FOCUS = ['AWS infrastructure in Terraform and SAM', 'Python APIs with FastAPI and Django', 'Geospatial projects with QGIS and PostGIS'];

const Home = memo(function Home() {
  return (
    <section id="home" aria-label="Introduction" className="hero-plane relative overflow-hidden">
      <div className="shell relative pt-28 pb-16 sm:pt-32 sm:pb-20 lg:pt-36 lg:pb-24">
        <div className="flex flex-col gap-12 lg:grid lg:grid-cols-12 lg:gap-x-10 xl:gap-x-14 lg:items-center">
          <div className="lg:col-span-6 xl:col-span-7 min-w-0">
            <p className="text-rise text-[0.9375rem] leading-snug text-ink-muted">
              {PERSONAL_INFO.title}
              <span className="text-ink-faint" aria-hidden="true"> · </span>
              {PERSONAL_INFO.location}
              <span className="mt-1.5 flex items-center gap-2 text-signal">
                <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-signal" />
                Open to new roles
              </span>
            </p>

            <h1 className="mt-5 sm:mt-6 font-display font-normal text-ink text-[clamp(2.75rem,1.1rem+6.5vw,5.5rem)] leading-[1.02] tracking-[-0.01em]">
              <span className="block"><span className="text-reveal">Hi, I&apos;m</span></span>
              <span className="block"><span className="text-reveal [animation-delay:150ms]">{PERSONAL_INFO.name}.</span></span>
            </h1>

            <p className="text-rise mt-6 sm:mt-8 max-w-[38ch] text-[clamp(1.0625rem,0.95rem+0.55vw,1.3125rem)] leading-[1.5] text-ink-soft [animation-delay:120ms]">
              {PERSONAL_INFO.intro}
            </p>

            <ul aria-label="Focus" className="text-rise mt-6 flex flex-wrap gap-x-5 gap-y-2 text-[0.9375rem] text-ink-muted [animation-delay:160ms]">
              {FOCUS.map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span aria-hidden="true" className="h-1 w-1 rounded-full bg-accent" />
                  {item}
                </li>
              ))}
            </ul>

            <div className="text-rise mt-8 sm:mt-10 flex flex-wrap gap-3 [animation-delay:200ms]">
              <a href="#work" className="btn-primary">
                Selected work <span aria-hidden="true">↓</span>
              </a>
              <Link to={ROUTES.projects} className="btn-secondary">All projects</Link>
            </div>

            <div className="text-rise mt-8 [animation-delay:280ms]">
              <SocialIcons source="hero" />
            </div>
          </div>

          <div className="mx-auto w-full max-w-[22rem] sm:max-w-[26rem] lg:max-w-none lg:col-span-6 xl:col-span-5 text-rise [animation-delay:200ms]">
            <Suspense
              fallback={
                <div
                  className="aspect-square w-full rounded-full bg-paper-sunk/80"
                  aria-hidden="true"
                />
              }
            >
              <HeroGlobe />
            </Suspense>
          </div>
        </div>
      </div>
    </section>
  );
});

export default Home;
