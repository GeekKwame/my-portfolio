import { memo } from 'react';
import Section from './Section';
import RecordEntry from './RecordEntry';
import m365connectLogo from '../assets/images/companies/m365connect.png';
import oneHealthLogo from '../assets/images/companies/onehealthtech.png';
import amalitechLogo from '../assets/images/companies/Amalitech.png';
import afarinickLogo from '../assets/images/companies/afarinick_company_limited_logo.jpg';
import graLogo from '../assets/images/companies/GRA.webp';
import knustLogo from '../assets/images/companies/knust.jpg';
import hubbleMindLogo from '../assets/images/companies/hubblemind.jpg';
import leratoLogo from '../assets/images/companies/lerato.jpg';

const EXPERIENCES = [
  {
    id: 'afarinick',
    title: 'Software Engineer',
    company: 'Afarinick Company Limited',
    type: 'Full-time',
    duration: 'Sep 2026 – Present',
    location: 'Accra, Ghana · On-site',
    isCurrent: true,
    description: 'Engineering and maintaining application architecture, backend services, and business-system modules while supporting code quality and system maintenance.',
    skills: ['Software Engineering', 'Backend Development', 'System Architecture'],
    logo: afarinickLogo,
    logoText: 'AF',
  },
  {
    id: 'amalitech',
    title: 'Software Engineering Team Lead',
    company: 'AmaliTech',
    type: 'Team Lead / Internship',
    duration: 'Aug 2026 – Sep 2026',
    location: 'Accra, Ghana · Remote',
    description: 'Led an intern engineering team through development cycles, coordinating architecture breakdown, task delivery, pull-request reviews, and working services.',
    skills: ['Team Leadership', 'Backend Engineering', 'CI/CD', 'Code Review'],
    logo: amalitechLogo,
    logoText: 'AT',
  },
  {
    id: 'one-health',
    title: 'Cloud & DevOps Engineer',
    company: 'One Health Global Technologies',
    type: 'Part-time',
    duration: 'Jul 2026 – Sep 2026',
    location: 'Accra, Ghana · Remote',
    description: 'Designed reproducible AWS infrastructure with Terraform, automated Docker-based delivery with GitHub Actions, and configured application logging and alerts.',
    skills: ['AWS', 'Terraform', 'Docker', 'GitHub Actions', 'ECS Fargate'],
    logo: oneHealthLogo,
    logoText: 'OH',
  },
  {
    id: 'knust',
    title: 'IT Technician',
    company: 'KNUST',
    duration: 'Oct 2024 – Sep 2025',
    location: 'Kumasi, Ghana',
    description: 'Delivered Tier 1 and Tier 2 technical support, assisted with Active Directory administration, and documented repeatable technical procedures.',
    skills: ['IT Support', 'Active Directory', 'Troubleshooting', 'Documentation'],
    logo: knustLogo,
    logoText: 'KNUST',
  },
  {
    id: 'm365connect',
    title: 'Python Developer (Backend)',
    company: 'M365Connect',
    type: 'Internship',
    duration: 'Dec 2024 – Mar 2025',
    location: 'Germany · Remote',
    description: 'Built Django REST Framework endpoints for data exchange, automated structured data collection in Python, and improved ORM queries.',
    skills: ['Python', 'Django REST Framework', 'REST APIs', 'ORM', 'Automation'],
    logo: m365connectLogo,
    logoText: 'M365',
  },
  {
    id: 'hubble-mind',
    title: 'Data Science Intern',
    company: 'HubbleMind',
    type: 'Internship',
    duration: 'Nov 2024 – Dec 2024',
    description: 'Prepared health data and trained machine-learning classifiers as part of a data science internship project.',
    skills: ['Data Preparation', 'Machine Learning', 'Python'],
    logo: hubbleMindLogo,
    logoClassName: 'object-cover',
    logoText: 'HM',
  },
  {
    id: 'lerato',
    title: 'POS Technician & IT Support',
    company: 'Lerato Consult',
    duration: 'Nov 2022 – Dec 2024',
    location: 'Greater Accra, Ghana',
    description: 'Installed and configured POS systems for retail and hospitality environments and documented troubleshooting and support procedures.',
    skills: ['POS Configuration', 'IT Support', 'Troubleshooting', 'Business Technology'],
    logo: leratoLogo,
    logoClassName: 'object-cover object-top',
    logoText: 'LC',
  },
  {
    id: 'gra',
    title: 'Data Entry, Returns Processing & IT Support Intern',
    company: 'Ghana Revenue Authority (GRA)',
    type: 'Internship',
    duration: 'Sep 2023 – Nov 2023',
    location: 'Accra, Ghana',
    description: 'Supported returns processing through accurate records entry and administrative data handling, and provided office IT support within established operational workflows.',
    skills: ['Data Accuracy', 'Information Management', 'Returns Processing', 'Operational Workflows', 'IT Support'],
    logo: graLogo,
    logoText: 'GRA',
  },
];

const Experience = memo(function Experience() {
  return (
    <Section
      id="experience"
      number="04"
      label="Experience"
      title="Professional record"
      lede="Software engineering, cloud delivery, data operations, and hands-on technology support—ordered by most recent completion date."
    >
      <ol className="divide-y divide-rule border-y border-rule">
        {EXPERIENCES.map((experience) => (
          <RecordEntry key={experience.id} organization={experience.company} {...experience} />
        ))}
      </ol>
    </Section>
  );
});

export default Experience;
