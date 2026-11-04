import { memo } from 'react';
import Section from './Section';
import ScribblePortrait from './ScribblePortrait';
import profilePic from '../assets/images/profile/profile-pic.webp';
import { PERSONAL_INFO } from '../config/constants';

const PRINCIPLES = [
  {
    title: 'Infrastructure is declared, not clicked',
    body: 'Production resources live in Terraform or AWS SAM, so every environment can be reviewed, reproduced, and rolled back, with no manual drift.',
  },
  {
    title: 'Short-lived credentials over stored keys',
    body: 'Where a pipeline deploys to AWS, I prefer OIDC federation, so each run gets temporary STS credentials instead of an access key sitting in repository secrets.',
  },
  {
    title: 'Isolation by default',
    body: 'Every query is scoped to its tenant, and sensitive comparisons run in constant time where it matters.',
  },
  {
    title: 'Tests gate the pipeline',
    body: 'Tests and linting run in CI on every push, against a real database service where the code depends on one.',
  },
];

const EDUCATION = [
  { what: 'BSc Applied Mathematics', where: 'KNUST, Kumasi', when: '2021 – 2024' },
  { what: 'Cloud Computing & AI Program (AWS)', where: 'Azubi Africa', when: '2026' },
];

const About = memo(function About() {
  return (
    <Section
      id="about"
      number="04"
      label="About"
      title="A systems mindset, from the ground up"
    >
      <div className="grid items-start gap-10 sm:grid-cols-[minmax(0,15.5rem)_minmax(0,1fr)] sm:gap-14">
        <div className="mx-auto w-full max-w-[15.5rem]">
          <ScribblePortrait src={profilePic} alt={`Portrait of ${PERSONAL_INFO.name}`} className="w-full" />
          <dl className="mt-5 rounded-xl border border-rule bg-paper-raised p-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-rule pb-2">
              <dt className="text-ink-muted">Base</dt>
              <dd className="font-semibold text-ink">{PERSONAL_INFO.location}</dd>
            </div>
            <div className="flex items-center justify-between border-b border-rule py-2">
              <dt className="text-ink-muted">Foundation</dt>
              <dd className="font-semibold text-ink">Applied Math</dd>
            </div>
            <div className="flex items-center justify-between pt-2">
              <dt className="text-ink-muted">Focus</dt>
              <dd className="font-semibold text-accent-strong">Cloud · API · GIS</dd>
            </div>
          </dl>
        </div>
        <div className="space-y-5 max-w-prose text-[1.0625rem] leading-[1.7] text-ink-soft">
          <p className="font-semibold text-ink text-[clamp(1.125rem,1rem+0.6vw,1.375rem)] leading-snug">
            {PERSONAL_INFO.bio}
          </p>
          <p>
            I studied Applied Mathematics, and the habit stuck: I like systems I can reason about, with clear
            data flow, explicit failure modes, and reliability I can measure.
          </p>
          <p>
            I started in hands-on IT support, which taught me what actually breaks in production and how much
            good documentation is worth. From there I moved into backend engineering, then into the cloud. The
            thread through all of it: infrastructure is part of the product, not something bolted on after it.
          </p>

          <p>
            I’m now developing my geospatial skills alongside my software engineering work at Afarinick.
            My Ghana Cocoa Belt project explores QGIS, coordinate systems, spatial joins and geometry
            validation using synthetic farms. Asase GIS connects that learning to GeoDjango, PostGIS
            and web mapping. These personal projects document what I can build and what I’m learning next.
          </p>

          <div className="pt-4">
            <h3 className="label">Education</h3>
            <ul className="mt-3 divide-y divide-rule border-y border-rule">
              {EDUCATION.map((item) => (
                <li key={item.what} className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-3 text-[0.9375rem]">
                  <span className="text-ink">{item.what} <span className="text-ink-muted">· {item.where}</span></span>
                  <span className="font-mono text-meta text-ink-muted">{item.when}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-20 sm:mt-24">
        <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-ink pb-4">
          <h3 className="text-2xl text-ink">How I work</h3>
          <span className="font-mono text-xs uppercase tracking-[0.08em] text-ink-muted">Engineering invariants</span>
        </div>
        <ol className="mt-6 grid gap-5 sm:grid-cols-2">
          {PRINCIPLES.map((item, i) => (
            <li key={item.title} className="rounded-2xl border border-rule bg-paper-raised p-6 transition-colors hover:border-ink/40">
              <div className="flex items-center justify-between">
                <p className="font-mono text-xs font-semibold text-accent-strong">INV-0{i + 1}</p>
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent" />
              </div>
              <h4 className="mt-3 text-[1.375rem] text-ink">{item.title}</h4>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-muted max-w-prose">{item.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
});

export default About;
