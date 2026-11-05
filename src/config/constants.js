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
