/**
 * Application Constants
 * Centralized configuration for Blessing Edmund's Engineering Portfolio
 */

export const SITE_URL = 'https://devedmund.vercel.app/';

/** LinkedIn headline — single source of truth for positioning across the site */
export const HEADLINE =
  'Software Engineer | Python · FastAPI · Django · React | AWS · Terraform · CI/CD | Open to Opportunities';

/** Contact email — single source of truth for mailto, contact form, and footer */
export const CONTACT_EMAIL = 'dogbeblessingkwame@gmail.com';

export const SEO = {
  title: 'Blessing Edmund | Cloud & Backend Engineer',
  description:
    'Cloud and backend engineer in Ghana building Python APIs and AWS infrastructure, with geospatial projects in QGIS, GeoDjango and PostGIS. Explore case studies and mapping work.',
  keywords:
    'Software Engineer, Cloud Engineer, AWS, Terraform, Docker, FastAPI, Django, Python Developer, PostgreSQL, React, Linux, DevOps, CI/CD, GitHub Actions, Ghana, Portfolio, QGIS, PostGIS, GeoDjango, Geospatial',
  ogSiteName: 'Blessing Edmund Portfolio',
};

export const PERSONAL_INFO = {
  name: 'Blessing Edmund',
  initials: 'BEKD',
  fullName: 'Blessing Edmund Kwame Dogbe',
  title: 'Cloud & Backend Engineer',
  headline: HEADLINE,
  bio: 'Cloud and backend engineer building production Python APIs and AWS infrastructure with Terraform, Docker, and CI/CD.',
  intro:
    'I build Python backends and the AWS infrastructure they run on: declared in Terraform or SAM, deployed through CI/CD, and tested before they ship.',
  currentRole: 'Software Engineer at Afarinick Company Limited',
  location: 'Accra, Ghana',
  timezone: 'GMT',
  availability: 'Open to full-time engineering roles, freelance infrastructure work, and technical collaborations.',
  email: CONTACT_EMAIL,
};

/** Home base shown on the hero globe (Accra, Ghana) */
export const HOME_BASE = {
  lat: 5.6037,
  lng: -0.187,
  city: 'Accra',
  country: 'Ghana',
  iso: 'GH',
  label: 'Accra',
};

/**
 * Verified engineering waypoints plotted on the interactive Earth.
 * Every entry corresponds to real work, education, or infrastructure in this portfolio.
 */
export const ENGINEERING_WAYPOINTS = [
  {
    id: 'accra',
    shortLabel: 'Accra · HQ',
    title: 'Accra, Ghana · Home Base',
    role: 'Engineering Hub',
    coords: '5.60° N / 0.19° W · GMT',
    lat: 5.6037,
    lng: -0.187,
    altitude: 2.25,
    summary: 'Software Engineer at Afarinick Company Limited; Cloud & DevOps at One Health Global; Team Lead at AmaliTech.',
    stack: 'Python · FastAPI · AWS · Terraform',
    href: '/#experience',
    linkLabel: 'Experience record',
    isHome: true,
  },
  {
    id: 'western-north',
    shortLabel: 'Western North · GIS',
    title: 'Western North · Cocoa Belt GIS',
    role: 'Geospatial & Cartography',
    coords: '6.30° N / 2.80° W · EPSG:32630',
    lat: 6.3,
    lng: -2.8,
    altitude: 2.05,
    summary: '20 synthetic cocoa plots (71.6 ha) across nine districts in UTM Zone 30N, joined with OCHA boundaries and Hansen forest-loss rasters.',
    stack: 'QGIS · PyQGIS · GeoPackage · GDAL',
    href: '/projects#ghana-cocoa-belt',
    linkLabel: 'Ghana Cocoa Belt study',
  },
  {
    id: 'kumasi',
    shortLabel: 'Kumasi · KNUST',
    title: 'Kumasi · KNUST & YɛnCare',
    role: 'Full-Stack & Applied Math',
    coords: '6.67° N / 1.57° W · Ashanti',
    lat: 6.6745,
    lng: -1.5716,
    altitude: 2.1,
    summary: 'Passwordless clinic booking and live virtual queue for the KNUST Students’ Clinic, backed by 468 backend and 34 Playwright E2E tests.',
    stack: 'React PWA · Express · MongoDB · Playwright',
    href: '/projects#yencare',
    linkLabel: 'YɛnCare case study',
  },
  {
    id: 'germany',
    shortLabel: 'Germany · API',
    title: 'Germany · M365Connect (Remote)',
    role: 'Backend Engineering',
    coords: '51.17° N / 10.45° E · Europe',
    lat: 51.1657,
    lng: 10.4515,
    altitude: 2.3,
    summary: 'Built Django REST Framework APIs powering data exchange across 3 client web applications and automated Python ingestion pipelines.',
    stack: 'Python · Django REST Framework · ORM',
    href: '/#experience',
    linkLabel: 'M365Connect record',
  },
  {
    id: 'aws-cloud',
    shortLabel: 'AWS Cloud · IaC',
    title: 'AWS Cloud · Multi-AZ & Edge',
    role: 'Cloud & Serverless Architecture',
    coords: '53.35° N / 6.26° W · Cloud Topologies',
    lat: 53.3498,
    lng: -6.2603,
    altitude: 2.3,
    summary: 'Multi-Tenant File Service across 2 AZs (12 Terraform modules) and Event-Connect serverless platform (23 AWS SAM resources behind WAF).',
    stack: 'Terraform · ECS Fargate · CloudFront · WAF',
    href: '/projects#file-service',
    linkLabel: 'File Service case study',
  },
];

/** Verified portfolio metrics shown in the hero telemetry strip */
export const PORTFOLIO_TELEMETRY = [
  {
    metric: '13',
    unit: 'Builds',
    label: 'Open-source repositories',
    detail: '4 full case studies, 6 systems & tools, 3 infrastructure labs',
    href: '/projects',
  },
  {
    metric: '500+',
    unit: 'CI Tests',
    label: 'Automated verification',
    detail: 'pytest, moto, and Playwright E2E against real database services',
    href: '/projects#yencare',
  },
  {
    metric: 'IaC',
    unit: 'Terraform · SAM',
    label: 'Declarative cloud topologies',
    detail: '12-module ECS Fargate VPCs, 23-resource SAM stacks, OIDC deploys',
    href: '/projects#file-service',
  },
  {
    metric: 'UTM 30N',
    unit: 'EPSG:32630',
    label: 'Geospatial engineering',
    detail: 'QGIS cartography, PyQGIS automation, GeoDjango & PostGIS',
    href: '/projects#ghana-cocoa-belt',
  },
];

export const SOCIAL_LINKS = [
  {
    id: 1,
    platform: 'LinkedIn',
    url: 'https://www.linkedin.com/in/edmund-blessing/',
    handle: 'in/edmund-blessing',
    icon: 'FaLinkedin',
    label: 'LinkedIn profile',
  },
  {
    id: 2,
    platform: 'GitHub',
    url: 'https://github.com/GeekKwame',
    handle: '@GeekKwame',
    icon: 'FaGithub',
    label: 'GitHub profile',
  },
  {
    id: 3,
    platform: 'Email',
    url: `mailto:${CONTACT_EMAIL}`,
    handle: CONTACT_EMAIL,
    icon: 'FaEnvelope',
    label: 'Send an email',
  },
];

/**
 * Primary navigation. `section` must match a section id on the homepage;
 * `route` marks a separate page.
 */
export const NAVIGATION_LINKS = [
  { id: 'work', name: 'Work', href: '/#work', section: 'work' },
  { id: 'projects', name: 'Projects', href: '/projects', route: '/projects' },
  { id: 'experience', name: 'Experience', href: '/#experience', section: 'experience' },
  { id: 'about', name: 'About', href: '/#about', section: 'about' },
  { id: 'contact', name: 'Contact', href: '/#contact', section: 'contact' },
];

/** Homepage sections in order, with their numbers — used by section headers and the footer index */
export const SECTION_INDEX = [
  { number: '01', name: 'Work', to: 'work' },
  { number: '02', name: 'Skills', to: 'skills' },
  { number: '03', name: 'Experience', to: 'experience' },
  { number: '04', name: 'About', to: 'about' },
  { number: '05', name: 'Contact', to: 'contact' },
];

export const RESUME = {
  filename: 'Blessing_Edmund_Kwame_Dogbe_Resume.pdf',
  path: '/resume.pdf',
};

export const TOAST_DURATION = {
  SHORT: 2000,
  MEDIUM: 4000,
  LONG: 6000,
};
