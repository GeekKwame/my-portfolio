/**
 * Application Constants
 * Centralized configuration for Blessing Edmund's Engineering Portfolio
 */

export const SITE_URL = 'https://devedmund.vercel.app/';

/** LinkedIn headline — single source of truth for positioning across the site */
export const HEADLINE =
  'Software Engineer | Backend & Cloud | Web Applications | Data & GIS';

/** Contact email — single source of truth for mailto, contact form, and footer */
export const CONTACT_EMAIL = 'dogbeblessingkwame@gmail.com';

export const SEO = {
  title: 'Blessing Edmund | Software Engineer | Backend & Cloud | Web Applications | Data & GIS',
  description:
    'Software engineer in Accra building reliable APIs, web applications, cloud infrastructure, automation, and geospatial systems for practical outcomes.',
  keywords:
    'Software Engineer, Backend Engineer, Cloud Engineer, Web Application Development, API Engineering, AWS, Terraform, Docker, FastAPI, Django, Python, JavaScript, React, PostgreSQL, DevOps, CI/CD, Automation, QGIS, PostGIS, GeoDjango, GIS, Ghana',
  ogSiteName: 'Blessing Edmund Portfolio',
};

export const PERSONAL_INFO = {
  name: 'Blessing Edmund',
  initials: 'BEKD',
  fullName: 'Blessing Edmund Kwame Dogbe',
  title: 'Software Engineer',
  headline: HEADLINE,
  bio: 'Software engineer building reliable APIs, web applications, cloud infrastructure, automation, and geospatial systems.',
  intro:
    "I'm Blessing Edmund Kwame Dogbe, a software engineer building reliable APIs, web applications, and cloud infrastructure. I also work with automation, geospatial data, and business technology—connecting good engineering to practical outcomes.",
  currentRole: 'Software Engineer at Afarinick Company Limited',
  location: 'Accra, Ghana',
  timezone: 'GMT',
  availability: 'Open to full-time software engineering roles, international remote or contract work, and selected freelance engagements.',
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
  { id: 'services', name: 'Services', href: '/#services', section: 'services' },
  { id: 'projects', name: 'Projects', href: '/projects', route: '/projects' },
  { id: 'experience', name: 'Experience', href: '/#experience', section: 'experience' },
  { id: 'about', name: 'About', href: '/#about', section: 'about' },
  { id: 'contact', name: 'Contact', href: '/#contact', section: 'contact' },
];

/** Homepage sections in order, with their numbers — used by section headers and the footer index */
export const SECTION_INDEX = [
  { number: '01', name: 'Work', to: 'work' },
  { number: '02', name: 'Services', to: 'services' },
  { number: '03', name: 'Skills', to: 'skills' },
  { number: '04', name: 'Experience', to: 'experience' },
  { number: '05', name: 'About', to: 'about' },
  { number: '06', name: 'Contact', to: 'contact' },
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
