import { memo } from 'react';
import Section from './Section';
import Link from './Link';
import { projectHref } from '../data/projects';

const SERVICES = [
  {
    title: 'Backend systems & APIs',
    body: 'I design dependable APIs, authentication flows, integrations, data models, and background jobs that are clear to maintain and ready to grow.',
    evidence: [
      { label: 'File Service API', to: projectHref('file-service') },
      { label: 'YɛnCare', to: projectHref('yencare') },
    ],
  },
  {
    title: 'Cloud, DevOps & deployment',
    body: 'I set up AWS infrastructure, containerise applications, automate delivery, and add the monitoring and documentation a team needs to run them confidently.',
    evidence: [
      { label: 'Event-Connect', to: projectHref('event-connect') },
      { label: 'File Service API', to: projectHref('file-service') },
    ],
  },
  {
    title: 'Web applications',
    body: 'I build responsive web products with thoughtful user journeys, dependable APIs, sensible permissions, and validation that helps people recover from mistakes.',
    evidence: [
      { label: 'YɛnCare', to: projectHref('yencare') },
      { label: 'KORA', to: projectHref('kora') },
    ],
  },
  {
    title: 'Data, automation & GIS',
    body: 'I turn operational and spatial data into useful pipelines, checks, analysis, automations, and maps, with the limits made clear from the start.',
    evidence: [
      { label: 'Ghana Cocoa Belt', to: projectHref('ghana-cocoa-belt') },
      { label: 'Asase GIS', to: projectHref('asase-gis') },
    ],
  },
  {
    title: 'Business systems & IT support',
    body: 'I configure and support everyday technology, write procedures people can actually follow, and troubleshoot the systems staff and customers depend on.',
    evidence: [
      { label: 'Professional experience', to: '/#experience' },
    ],
  },
];

const Services = memo(function Services() {
  return (
    <Section
      id="services"
      number="02"
      label="Services"
      wide
      title="Ways I can help"
      lede="Whether you need a product built, a cloud setup made dependable, or everyday systems made easier to run, I can help from the first idea to life after launch."
    >
      <ol className="grid gap-px overflow-hidden rounded-2xl border border-rule bg-rule md:grid-cols-2 xl:grid-cols-12">
        {SERVICES.map((service, index) => (
          <li
            key={service.title}
            className={`flex min-h-full flex-col bg-paper-raised p-6 sm:p-7 ${index === SERVICES.length - 1 ? 'md:col-span-2 xl:col-span-6' : index >= 3 ? 'xl:col-span-6' : 'xl:col-span-4'}`}
          >
            <p className="font-mono text-meta text-accent-strong">{String(index + 1).padStart(2, '0')}</p>
            <h3 className="mt-4 text-xl text-ink">{service.title}</h3>
            <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-muted">{service.body}</p>
            <p className="mt-auto pt-6 text-sm leading-relaxed text-ink-muted">
              <span className="label mr-2">See it in</span>
              {service.evidence.map((item, itemIndex) => (
                <span key={item.to}>
                  <Link to={item.to} className="link !text-ink-muted hover:!text-accent-strong">{item.label}</Link>
                  {itemIndex < service.evidence.length - 1 && <span aria-hidden="true">, </span>}
                </span>
              ))}
            </p>
          </li>
        ))}
      </ol>
    </Section>
  );
});

export default Services;
