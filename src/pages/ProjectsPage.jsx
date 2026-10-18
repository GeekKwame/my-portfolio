import { useEffect, useState } from 'react';
import Figure from '../components/Figure';
import Tags from '../components/Tags';
import ProjectLinks from '../components/ProjectLinks';
import useDocumentMeta from '../hooks/useDocumentMeta';
import {
  ADDITIONAL_PROJECTS,
  FEATURED_PROJECTS,
  FOCUS_AREAS,
  PROJECTS,
  SUPPORTING_PROJECTS,
} from '../data/projects';
import { PERSONAL_INFO } from '../config/constants';
import { ROUTES } from '../routing/navigation';

const ALL = 'all';

const COUNTS = Object.fromEntries(FOCUS_AREAS.map((area) => [area.id, PROJECTS.filter((p) => p.focus.includes(area.id)).length]));
const AREAS = FOCUS_AREAS.filter((area) => COUNTS[area.id] > 0);

function readFocus() {
  if (window.location.hash) return ALL;
  const value = new URLSearchParams(window.location.search).get('focus');
  return AREAS.some((area) => area.id === value) ? value : ALL;
}

function meta(project) {
  return [project.category, project.status, project.year].filter(Boolean).join(' · ');
}

function CaseStudy({ project, number }) {
  const titleId = `${project.slug}-title`;
  const rows = [
    ['Problem', project.problem],
    ['Approach', project.approach],
    ['Key decision', project.decision],
  ].filter(([, text]) => text);

  return (
    <article id={project.slug} aria-labelledby={titleId} className="project-target scroll-mt-24 border-t border-ink pt-6 sm:pt-8">
      <header className="flex flex-wrap items-end justify-between gap-x-8 gap-y-5">
        <div className="min-w-0 max-w-2xl">
          <p className="label">
            <span className="text-accent-strong">{String(number).padStart(2, '0')}</span>
            <span aria-hidden="true" className="mx-2 text-ink-faint">/</span>
            {meta(project)}
          </p>
          <h3 id={titleId} className="mt-2 text-ink text-[clamp(1.875rem,1.2rem+2.2vw,3.25rem)] tracking-[-0.03em]">
            {project.title}
          </h3>
          <p className="mt-3 text-lg leading-relaxed text-ink-soft">{project.summary}</p>
        </div>
        <ProjectLinks project={project} />
      </header>

      {project.image && (
        <div className="mt-8">
          <Figure image={project.image} number={String(number).padStart(2, '0')} />
        </div>
      )}

      <dl className="mt-10 divide-y divide-rule border-y border-rule">
        {rows.map(([term, text]) => (
          <div key={term} className="grid gap-2 py-5 md:grid-cols-[10rem_minmax(0,1fr)] md:gap-8">
            <dt className="text-[0.9375rem] font-semibold text-ink">{term}</dt>
            <dd className="max-w-prose leading-relaxed text-ink-soft">{text}</dd>
          </div>
        ))}
        {project.evidence?.length > 0 && (
          <div className="grid gap-2 py-5 md:grid-cols-[10rem_minmax(0,1fr)] md:gap-8">
            <dt className="text-[0.9375rem] font-semibold text-ink">Evidence</dt>
            <dd>
              <ul className="max-w-prose space-y-2 leading-relaxed text-ink-soft">
                {project.evidence.map((item) => (
                  <li key={item} className="grid grid-cols-[1rem_minmax(0,1fr)]">
                    <span aria-hidden="true" className="text-accent-strong">–</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        )}
        <div className="grid gap-2 py-5 md:grid-cols-[10rem_minmax(0,1fr)] md:gap-8">
          <dt className="text-[0.9375rem] font-semibold text-ink">Stack</dt>
          <dd><Tags items={project.stack} /></dd>
        </div>
      </dl>
    </article>
  );
}

function ProjectCard({ project }) {
  const titleId = `${project.slug}-title`;

  return (
    <article id={project.slug} aria-labelledby={titleId} className="project-target scroll-mt-24 flex flex-col rounded-2xl border border-rule p-6 sm:p-7">
      <p className="label">{meta(project)}</p>
      <h3 id={titleId} className="mt-2 text-[1.5rem] tracking-[-0.02em] text-ink">{project.title}</h3>
      <p className="mt-3 leading-relaxed text-ink-soft">{project.summary}</p>
      {project.approach && <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-muted">{project.approach}</p>}
      <p className="stack mt-5">{project.stack.join(' · ')}</p>
      <ProjectLinks project={project} variant="text" className="mt-auto pt-6" />
    </article>
  );
}

function SupportingRow({ project }) {
  const titleId = `${project.slug}-title`;

  return (
    <li id={project.slug} className="project-target scroll-mt-24 grid gap-x-8 gap-y-2 py-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-baseline">
      <div className="min-w-0">
        <h3 id={titleId} className="text-xl text-ink">
          {project.title}
          {project.status && <span className="ml-3 align-middle text-sm font-medium text-ink-muted">{project.status}</span>}
        </h3>
        <p className="mt-1 max-w-prose text-[0.9375rem] leading-relaxed text-ink-muted">{project.summary}</p>
        <p className="stack mt-2">{project.stack.join(' · ')}</p>
      </div>
      <ProjectLinks project={project} variant="text" className="md:justify-end" />
    </li>
  );
}

function Group({ id, title, lede, count, children }) {
  return (
    <section aria-labelledby={`${id}-title`} className="mt-20 first:mt-0 sm:mt-24">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-b border-ink pb-4">
        <h2 id={`${id}-title`} className="text-[clamp(1.5rem,1.2rem+1vw,2rem)] text-ink">{title}</h2>
        <p className="label">{count} {count === 1 ? 'project' : 'projects'}</p>
      </div>
      {lede && <p className="mt-4 max-w-prose text-ink-muted">{lede}</p>}
      <div className="mt-10">{children}</div>
    </section>
  );
}

export default function ProjectsPage() {
  useDocumentMeta({
    title: `Projects | ${PERSONAL_INFO.name}`,
    description: `Every project by ${PERSONAL_INFO.name}: AWS infrastructure in Terraform and SAM, Python and Node.js backends, and full-stack products, with notes on how each was built.`,
    path: ROUTES.projects,
  });

  const [focus, setFocus] = useState(readFocus);

  useEffect(() => {
    const url = new URL(window.location.href);
    if (focus === ALL) url.searchParams.delete('focus');
    else url.searchParams.set('focus', focus);
    window.history.replaceState(window.history.state, '', `${url.pathname}${url.search}${url.hash}`);
  }, [focus]);

  const matches = (project) => focus === ALL || project.focus.includes(focus);
  const featured = FEATURED_PROJECTS.filter(matches);
  const additional = ADDITIONAL_PROJECTS.filter(matches);
  const supporting = SUPPORTING_PROJECTS.filter(matches);

  return (
    <div className="shell pt-28 pb-24 sm:pt-32 lg:pt-36">
      <header className="max-w-3xl">
        <p className="label">Projects</p>
        <h1 className="section-title mt-3">Everything I&apos;ve built, with the reasoning behind it</h1>
        <p className="lede mt-5">
          {PROJECTS.length} projects. Case studies first, then smaller builds, then experiments and course work.
          Every entry links to its source.
        </p>
      </header>

      <div role="group" aria-label="Filter projects by focus" className="mt-10 flex flex-wrap gap-2.5">
        <button type="button" className="chip" aria-pressed={focus === ALL} onClick={() => setFocus(ALL)}>
          All <span className="font-mono text-meta opacity-70">{PROJECTS.length}</span>
        </button>
        {AREAS.map((area) => (
          <button key={area.id} type="button" className="chip" aria-pressed={focus === area.id} onClick={() => setFocus(area.id)}>
            {area.label} <span className="font-mono text-meta opacity-70">{COUNTS[area.id]}</span>
          </button>
        ))}
      </div>

      <p className="sr-only" aria-live="polite">
        {focus === ALL
          ? `Showing all ${PROJECTS.length} projects`
          : `Showing ${featured.length + additional.length + supporting.length} ${AREAS.find((a) => a.id === focus).label} projects`}
      </p>

      <div className="mt-16 sm:mt-20">
        {featured.length > 0 && (
          <Group id="case-studies" title="Case studies" count={featured.length}
            lede="In depth: the problem, how I approached it, and the decision that shaped the design.">
            <div className="space-y-20 sm:space-y-24">
              {featured.map((project) => (
                <CaseStudy key={project.slug} project={project} number={FEATURED_PROJECTS.indexOf(project) + 1} />
              ))}
            </div>
          </Group>
        )}

        {additional.length > 0 && (
          <Group id="more-projects" title="More projects" count={additional.length}>
            <div className="grid gap-6 md:grid-cols-2">
              {additional.map((project) => <ProjectCard key={project.slug} project={project} />)}
            </div>
          </Group>
        )}

        {supporting.length > 0 && (
          <Group id="experiments" title="Experiments and course work" count={supporting.length}
            lede="Smaller builds and guided labs. Useful practice, linked for completeness rather than depth.">
            <ul className="divide-y divide-rule border-b border-rule">
              {supporting.map((project) => <SupportingRow key={project.slug} project={project} />)}
            </ul>
          </Group>
        )}
      </div>
    </div>
  );
}
