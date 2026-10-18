import { memo } from 'react';
import Section from './Section';
import RecordEntry from './RecordEntry';
import m365connectLogo from "../assets/images/companies/m365connect.png";
import oneHealthLogo from "../assets/images/companies/onehealthtech.png";
import amalitechLogo from "../assets/images/companies/Amalitech.png";
import afarinickLogo from "../assets/images/companies/afarinick_company_limited_logo.jpg";

const EXPERIENCES = [
  {
    id: 8,
    title: "Software Engineer",
    company: "Afarinick Company Limited",
    type: "Full-time",
    duration: "Sep 2026 – Present",
    location: "Accra, Ghana · On-site",
    isCurrent: true,
    description: "Engineering and maintaining application architecture and backend services. Implementing software modules, managing code quality, and participating in system maintenance workflows.",
    skills: ["Software Engineering", "Backend Development", "System Architecture"],
    logo: afarinickLogo,
    logoText: "AF",
  },
  {
    id: 7,
    title: "Software Engineering Team Lead",
    company: "AmaliTech",
    type: "Team Lead / Internship",
    duration: "Aug 2026 – Sep 2026",
    location: "Accra, Ghana · Remote",
    description: "Led an engineering team of interns through hands-on development cycles, coordinating architecture breakdown and delivery of working services.",
    highlights: [
      "Guided task breakdown, pull request reviews, and sprint delivery.",
      "Engineered backend APIs, automated deployment pipelines, and resolved production debugging issues.",
    ],
    skills: ["Team Leadership", "Backend Engineering", "CI/CD", "Code Review"],
    logo: amalitechLogo,
    logoText: "AT",
  },
  {
    id: 1,
    title: "Cloud & DevOps Engineer",
    company: "One Health Global Technologies",
    type: "Part-time",
    duration: "Jul 2026 – Sep 2026",
    location: "Accra, Ghana · Remote",
    description: "Designed and provisioned secure AWS infrastructure with Terraform. Automated delivery with Docker and GitHub Actions.",
    highlights: [
      "Provisioned EC2, IAM, S3, VPC, Lambda, CloudWatch, and ECS Fargate for production workloads.",
      "Built declarative Terraform configurations to eliminate manual provisioning drift.",
      "Configured CloudWatch telemetry, logging, and alerting for availability.",
    ],
    skills: ["AWS", "Terraform", "Docker", "GitHub Actions", "ECS Fargate"],
    logo: oneHealthLogo,
    logoText: "OH",
  },
  {
    id: 4,
    title: "Python Developer (Backend)",
    company: "M365Connect",
    type: "Internship",
    duration: "Dec 2024 – Mar 2025",
    location: "Germany · Remote",
    description: "Built RESTful endpoints in Django REST Framework and automated data extraction pipelines in Python.",
    highlights: [
      "Designed REST APIs powering data exchange across 3 client web applications.",
      "Built automated scraping routines for structured dataset ingestion.",
      "Refactored ORM queries to improve database execution speed.",
    ],
    skills: ["Python", "Django REST Framework", "REST APIs", "ORM"],
    logo: m365connectLogo,
    logoText: "M365",
  },
];

const EARLIER = [
  { role: 'IT Technician', org: 'KNUST', duration: '2024 – 2025' },
  { role: 'Data Science Intern', org: 'HubbleMind', duration: '2024' },
  { role: 'OS Technician & IT Support', org: 'Lerato Consult', duration: '2022 – 2024' },
];

const Experience = memo(function Experience() {
  return (
    <Section
      id="experience"
      number="03"
      label="Experience"
      title="Professional record"
      lede="Most recent first."
    >
      <ol className="divide-y divide-rule border-y border-rule">
        {EXPERIENCES.map((exp) => (
          <RecordEntry key={exp.id} organization={exp.company} {...exp} />
        ))}
      </ol>

      <div className="mt-10">
        <h3 className="label">Earlier</h3>
        <ul className="mt-3 divide-y divide-rule border-y border-rule">
          {EARLIER.map((item) => (
            <li key={item.org} className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-3 text-[0.9375rem]">
              <span className="text-ink">{item.role} <span className="text-ink-muted">· {item.org}</span></span>
              <span className="font-mono text-meta text-ink-muted">{item.duration}</span>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
});

export default Experience;
