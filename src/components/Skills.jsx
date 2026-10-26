import { memo } from 'react';
import Section from './Section';
import Link from './Link';
import { PROJECTS, projectHref } from '../data/projects';

/** `evidence` lists project slugs where the capability is demonstrated. */
const CAPABILITY_GROUPS = [
  {
    category: 'Cloud infrastructure',
    items: ['Terraform', 'AWS SAM', 'ECS Fargate', 'Lambda', 'API Gateway', 'S3 + CloudFront (OAC)', 'VPC and ALB', 'AWS WAF'],
    evidence: ['file-service', 'event-connect', 'terraformed', 'serverless-api'],
  },
  {
    category: 'Backend engineering',
    items: ['Python', 'FastAPI', 'Django', 'Node.js + Express', 'SQLAlchemy 2.0', 'Pydantic', 'REST API design', 'Auth and rate limiting'],
    evidence: ['file-service', 'yencare', 'kora', 'renal-route'],
  },
  {
    category: 'Delivery & testing',
    items: ['GitHub Actions', 'Docker', 'IAM OIDC federation', 'CloudWatch', 'pytest and moto', 'Playwright', 'Linux and Bash'],
    evidence: ['file-service', 'yencare', 'terraformed', 'smart-task'],
  },
  {
    category: 'Data & geospatial',
    items: ['PostgreSQL', 'PostGIS + GeoDjango', 'QGIS + GeoPackage', 'Spatial joins and geometry validation', 'CRS transformation and area measurement', 'DynamoDB', 'MongoDB'],
    evidence: ['ghana-cocoa-belt', 'asase-gis', 'file-service'],
  },
];

const bySlug = Object.fromEntries(PROJECTS.map((p) => [p.slug, p]));

const Skills = memo(function Skills() {
  return (
    <Section
      id="skills"
      number="02"
      label="Skills"
      title="What I work with, and where it shows up"
      lede="Grouped by capability rather than listed as logos. Each group links to the projects that use it."
    >
      <div className="grid gap-x-10 gap-y-12 sm:grid-cols-2 xl:grid-cols-4 xl:gap-x-8">
        {CAPABILITY_GROUPS.map((group) => (
          <div key={group.category} className="flex flex-col border-t border-ink pt-4">
            <h3 className="text-[1.375rem] text-ink">{group.category}</h3>
            <ul className="mt-4 space-y-1.5 text-[0.9375rem] text-ink-soft">
              {group.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="mt-auto pt-5 text-sm leading-8 text-ink-muted">
              <span className="label mr-2">Used in</span>
              {group.evidence.map((slug, i) => (
                <span key={slug}>
                  <Link to={projectHref(slug)} className="link !text-ink-muted hover:!text-accent-strong">
                    {bySlug[slug].shortTitle}
                  </Link>
                  {i < group.evidence.length - 1 && <span aria-hidden="true">, </span>}
                </span>
              ))}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
});

export default Skills;
