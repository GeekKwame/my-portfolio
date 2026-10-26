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
      title="From campus IT support to production cloud systems"
    >
      <div className="grid items-start gap-10 sm:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] sm:gap-14">
        <ScribblePortrait src={profilePic} alt={`Portrait of ${PERSONAL_INFO.name}`} className="mx-auto w-full max-w-[15rem]" />
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
        <h3 className="text-2xl text-ink border-b border-ink pb-4">How I work</h3>
        <ol className="grid sm:grid-cols-2 sm:gap-x-10">
          {PRINCIPLES.map((item, i) => (
            <li key={item.title} className="border-b border-rule py-6">
              <p className="font-mono text-meta text-accent-strong">{String(i + 1).padStart(2, '0')}</p>
              <h4 className="mt-2 text-[1.375rem] text-ink">{item.title}</h4>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-muted max-w-prose">{item.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
});

export default About;
