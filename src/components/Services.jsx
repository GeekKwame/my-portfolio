import { memo } from 'react';
import Section from './Section';
import Link from './Link';
import { projectHref } from '../data/projects';

const SERVICES = [
  {
    title: 'Backend development & API engineering',
    body: 'Design and build maintainable APIs, authentication flows, integrations, data models, and background workflows for web and business applications.',
    evidence: [
      { label: 'File Service API', to: projectHref('file-service') },
      { label: 'YɛnCare', to: projectHref('yencare') },
    ],
  },
  {
    title: 'Cloud infrastructure, DevOps & deployment',
    body: 'Define AWS infrastructure, containerise applications, automate delivery, and add the observability and operational documentation needed to run them.',
    evidence: [
      { label: 'Event-Connect', to: projectHref('event-connect') },
      { label: 'File Service API', to: projectHref('file-service') },
    ],
  },
  {
    title: 'Web application development',
    body: 'Build responsive web products that connect clear user journeys to dependable APIs, permissions, validation, and deployment workflows.',
    evidence: [
      { label: 'YɛnCare', to: projectHref('yencare') },
      { label: 'KORA', to: projectHref('kora') },
    ],
  },
  {
    title: 'Data engineering, automation & GIS',
    body: 'Turn operational or spatial data into reliable ingestion, validation, analysis, automation, and mapping workflows with explicit limitations.',
    evidence: [
      { label: 'Ghana Cocoa Belt', to: projectHref('ghana-cocoa-belt') },
      { label: 'Asase GIS', to: projectHref('asase-gis') },
    ],
  },
  {
    title: 'POS configuration, IT systems & business technology',
    body: 'Configure and support day-to-day technology, document repeatable procedures, and troubleshoot the systems that staff and customers rely on.',
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
      title="Engineering support from build to operation"
      lede="Practical services for teams that need software delivered clearly, deployed reliably, and supported after launch."
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
              <span className="label mr-2">Evidence</span>
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
