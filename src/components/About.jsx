import { memo } from 'react';
import Section from './Section';
import ScribblePortrait from './ScribblePortrait';
import profilePic from '../assets/images/profile/profile-pic.webp';
import { PERSONAL_INFO } from '../config/constants';

const PRINCIPLES = [
  {
    title: 'Make infrastructure repeatable',
    body: 'I keep production resources in Terraform or AWS SAM so the setup can be reviewed, reproduced, and rolled back without relying on a trail of manual clicks.',
  },
  {
    title: 'Keep credentials short lived',
    body: 'When a pipeline deploys to AWS, I prefer OIDC federation. Each run gets temporary credentials, so there is no long-lived access key sitting in repository secrets.',
  },
  {
    title: 'Protect every tenant by default',
    body: 'I scope every query to its tenant and use constant-time comparisons for sensitive values where that protection matters.',
  },
  {
    title: 'Let tests stop bad changes',
    body: 'Tests and linting run in CI on every push. When the code depends on a database, the pipeline checks it against a real database service too.',
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
      number="05"
      label="About"
      title="Curious about the whole system"
    >
      <div className="grid items-start gap-10 sm:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] sm:gap-14">
        <ScribblePortrait src={profilePic} alt={`Portrait of ${PERSONAL_INFO.name}`} className="mx-auto w-full max-w-[15rem]" />
        <div className="space-y-5 max-w-prose text-[1.0625rem] leading-[1.7] text-ink-soft">
          <p className="font-semibold text-ink text-[clamp(1.125rem,1rem+0.6vw,1.375rem)] leading-snug">
            {PERSONAL_INFO.bio}
          </p>
          <p>
            Applied Mathematics taught me to enjoy difficult problems and ask better questions. That habit stayed
            with me: I like systems with clear data flows, predictable behaviour, and reliability I can measure.
          </p>
          <p>
            I started in hands-on IT support, where I learned what breaks for real people and how valuable clear
            documentation can be. That led me into backend engineering and then the cloud. Through all of it, I’ve
            treated infrastructure as part of the product, not an afterthought.
          </p>

          <p>
            I’m also growing my geospatial skills alongside my software engineering work at Afarinick.
            Ghana Cocoa Belt lets me explore QGIS, coordinate systems, spatial joins, and geometry validation
            with synthetic farms. Asase GIS takes that learning into GeoDjango, PostGIS, and web mapping.
            I share these projects openly because the learning matters as much as the finished result.
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
