import { memo, useState } from 'react';
import Section from './Section';
import Link from './Link';
import { PROJECTS, projectHref } from '../data/projects';

/** `evidence` lists project slugs where the capability is demonstrated. */
const CAPABILITY_GROUPS = [
  {
    code: '02.1',
    category: 'Cloud infrastructure',
    items: ['Terraform', 'AWS SAM', 'ECS Fargate', 'Lambda', 'API Gateway', 'S3 + CloudFront (OAC)', 'VPC and ALB', 'AWS WAF'],
    evidence: ['file-service', 'event-connect', 'terraformed', 'serverless-api'],
  },
  {
    code: '02.2',
    category: 'Backend engineering',
    items: ['Python', 'FastAPI', 'Django', 'Node.js + Express', 'SQLAlchemy 2.0', 'Pydantic', 'REST API design', 'Auth and rate limiting'],
    evidence: ['file-service', 'yencare', 'kora', 'renal-route'],
  },
  {
    code: '02.3',
    category: 'Delivery & testing',
    items: ['GitHub Actions', 'Docker', 'IAM OIDC federation', 'CloudWatch', 'pytest and moto', 'Playwright', 'Linux and Bash'],
    evidence: ['file-service', 'yencare', 'terraformed', 'smart-task'],
  },
  {
    code: '02.4',
    category: 'Web & AI integration',
    items: ['JavaScript', 'React', 'Progressive web apps', 'API integration', 'LLM provider adapters'],
    evidence: ['yencare', 'kora', 'renal-route'],
  },
  {
    code: '02.5',
    category: 'Data & geospatial',
    items: ['PostgreSQL', 'PostGIS + GeoDjango', 'QGIS + GeoPackage', 'Spatial joins and geometry validation', 'CRS transformation and area measurement', 'DynamoDB', 'MongoDB'],
    evidence: ['ghana-cocoa-belt', 'asase-gis', 'file-service'],
  },
];

const bySlug = Object.fromEntries(PROJECTS.map((p) => [p.slug, p]));
const EVIDENCE_SLUGS = ['file-service', 'yencare', 'ghana-cocoa-belt', 'event-connect', 'terraformed', 'kora', 'asase-gis', 'renal-route'];

const Skills = memo(function Skills() {
  const [selectedSlug, setSelectedSlug] = useState(null);

  return (
    <Section
      id="skills"
      number="02"
      label="Skills"
      title="Tools with a purpose"
      lede="The technologies I use to build, deploy, and maintain software. Highlight a project below or follow each capability to a build where it’s put to work."
    >
      {/* Interactive Capability-to-Project Highlighter */}
      <div className="mb-10 flex flex-wrap items-center gap-2 rounded-xl border border-rule bg-paper-raised p-3.5">
        <span className="font-mono text-xs uppercase tracking-[0.06em] text-ink-muted mr-1">
          Highlight domains by build:
        </span>
        <button
          type="button"
          aria-pressed={selectedSlug === null}
          onClick={() => setSelectedSlug(null)}
          className={`min-h-[34px] rounded-full border px-3 py-1 font-mono text-xs font-medium transition-colors ${
            selectedSlug === null
              ? 'border-ink bg-ink text-paper'
              : 'border-rule-strong bg-paper text-ink-muted hover:border-ink/50 hover:text-ink'
          }`}
        >
          All domains
        </button>
        {EVIDENCE_SLUGS.map((slug) => {
          const active = selectedSlug === slug;
          return (
            <button
              key={slug}
              type="button"
              aria-pressed={active}
              onClick={() => setSelectedSlug(active ? null : slug)}
              className={`min-h-[34px] rounded-full border px-3 py-1 font-mono text-xs font-medium transition-colors ${
                active
                  ? 'border-accent bg-ink text-paper'
                  : 'border-rule-strong bg-paper text-ink-muted hover:border-ink/50 hover:text-ink'
              }`}
            >
              {bySlug[slug]?.shortTitle}
            </button>
          );
        })}
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {CAPABILITY_GROUPS.map((group) => {
          const isHighlighted = selectedSlug ? group.evidence.includes(selectedSlug) : false;
          const isDimmed = selectedSlug && !isHighlighted;
          return (
            <div
              key={group.category}
              className={`flex flex-col rounded-2xl border p-6 transition-all duration-200 ${
                isHighlighted
                  ? 'border-accent bg-paper-raised ring-1 ring-accent'
                  : isDimmed
                    ? 'border-rule bg-paper opacity-55'
                    : 'border-rule bg-paper-raised hover:border-ink/40'
              }`}
            >
              <div className="flex items-center justify-between gap-2 border-b border-rule pb-3">
                <span className="font-mono text-xs font-semibold text-accent-strong">{group.code}</span>
                <span className="font-mono text-xs text-ink-muted">{group.items.length} capabilities</span>
              </div>
              <h3 className="mt-4 text-[1.375rem] text-ink">{group.category}</h3>
              <ul className="mt-4 space-y-2 text-[0.9375rem] text-ink-soft">
                {group.items.map((item) => (
                  <li key={item} className="flex items-baseline gap-2.5">
                    <span aria-hidden="true" className="font-mono text-xs text-accent-strong">›</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-auto border-t border-rule pt-4 text-sm leading-relaxed text-ink-muted">
                <span className="label mr-2">Used in</span>
                {group.evidence.map((slug, i) => (
                  <span key={slug}>
                    <Link
                      to={projectHref(slug)}
                      className={`link ${
                        selectedSlug === slug ? 'font-semibold !text-ink' : '!text-ink-muted hover:!text-accent-strong'
                      }`}
                    >
                      {bySlug[slug].shortTitle}
                    </Link>
                    {i < group.evidence.length - 1 && <span aria-hidden="true">, </span>}
                  </span>
                ))}
              </p>
            </div>
          );
        })}
      </div>
    </Section>
  );
});

export default Skills;
