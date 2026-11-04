import { memo, useState } from 'react';
import Section from './Section';
import Link from './Link';
import ProjectThumb from './ProjectThumb';
import ProjectLinks from './ProjectLinks';
import ArchitectureLab from './ArchitectureLab';
import { FEATURED_PROJECTS, PROJECTS, projectHref } from '../data/projects';
import { ROUTES } from '../routing/navigation';

const pad = (n) => String(n).padStart(2, '0');

function FeaturedCard({ project, number, wide, onInspectTrace }) {
  const titleId = `featured-${project.slug}-title`;

  return (
    <article
      aria-labelledby={titleId}
      className={`group flex flex-col overflow-hidden rounded-2xl border border-rule bg-paper-raised transition-[border-color,transform] duration-300
        hover:-translate-y-1 hover:border-ink/30 ${wide ? 'lg:col-span-2 lg:grid lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]' : ''}`}
    >
      {/* Same destination as the case-study button, so it is hidden from keyboard and screen readers. */}
      <Link to={projectHref(project.slug)} tabIndex={-1} aria-hidden="true" className="block">
        <ProjectThumb
          project={project}
          number={pad(number)}
          eager
          className={wide ? 'lg:h-full lg:aspect-auto lg:min-h-[22rem] lg:border-b-0 lg:border-r' : ''}
        />
      </Link>

      <div className="flex flex-1 flex-col p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="label">
            <span className="text-accent-strong">{pad(number)}</span>
            <span aria-hidden="true" className="mx-2 text-ink-faint">/</span>
            {project.capability}
          </p>
          <span className="font-mono text-[0.6875rem] text-ink-muted">{project.category}</span>
        </div>
        <h3 id={titleId} className="mt-3 text-[clamp(1.5rem,1.2rem+1vw,2.125rem)] tracking-[-0.025em] text-ink">
          {project.title}
        </h3>
        <p className="mt-3 max-w-prose leading-relaxed text-ink-soft">{project.summary}</p>
        {project.highlight && (
          <p className="mt-5 max-w-prose border-l-2 border-accent pl-4 text-[0.9375rem] leading-relaxed text-ink-muted">
            {project.highlight}
          </p>
        )}
        <p className="stack mt-5 font-mono text-xs">{project.stack.slice(0, 6).join(' · ')}</p>

        <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-3 pt-7">
          <Link to={projectHref(project.slug)} className="btn-secondary !min-h-[40px] !px-4 !text-sm">
            Case study <span aria-hidden="true">→</span>
            <span className="sr-only">: {project.title}</span>
          </Link>
          <button
            type="button"
            onClick={() => onInspectTrace(project.slug)}
            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full border border-rule-strong bg-paper px-3.5 font-mono text-xs font-medium text-ink-soft transition-colors hover:border-ink/50 hover:text-ink"
          >
            <span>Trace system</span>
            <span aria-hidden="true" className="text-accent-strong">▸</span>
          </button>
          <ProjectLinks project={project} variant="text" />
        </div>
      </div>
    </article>
  );
}

const FeaturedProjects = memo(function FeaturedProjects() {
  const [traceSlug, setTraceSlug] = useState('file-service');
  const moreCount = PROJECTS.length - FEATURED_PROJECTS.length;
  const oddCount = FEATURED_PROJECTS.length % 2 === 1;

  const handleInspectTrace = (slug) => {
    setTraceSlug(slug);
    document.getElementById('architecture-lab')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  return (
    <Section
      id="work"
      number="01"
      label="Work"
      wide
      title="Selected projects"
      lede="From Python APIs and AWS infrastructure to full-stack products and geospatial analysis. Explore the problem, the architecture, and the decisions behind each build."
    >
      <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
        {FEATURED_PROJECTS.map((project, i) => (
          <FeaturedCard
            key={project.slug}
            project={project}
            number={i + 1}
            wide={oddCount && i === 0}
            onInspectTrace={handleInspectTrace}
          />
        ))}
      </div>

      <div id="architecture-lab" className="mt-12 scroll-mt-24">
        <ArchitectureLab key={traceSlug} initialSlug={traceSlug} />
      </div>

      <div className="mt-12 flex flex-col gap-4 border-t border-ink pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-ink-muted">
          {moreCount} more, from an AWS security scanner to a PostGIS mapping prototype, each with notes on how it was built.
        </p>
        <Link to={ROUTES.projects} className="btn-primary self-start sm:self-auto">
          All {PROJECTS.length} projects <span aria-hidden="true">→</span>
        </Link>
      </div>
    </Section>
  );
});

export default FeaturedProjects;
