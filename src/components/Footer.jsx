import { memo } from 'react';
import { PERSONAL_INFO, SECTION_INDEX, RESUME } from '../config/constants';
import { ROUTES } from '../routing/navigation';
import { trackResumeDownload } from '../utils/analytics';
import SocialIcons from './SocialIcons';
import Link from './Link';

const Footer = memo(function Footer() {
  const year = new Date().getFullYear();
  const links = [
    ...SECTION_INDEX.map((item) => ({ name: item.name, to: `/#${item.to}` })),
    { name: 'All projects', to: ROUTES.projects },
  ];

  return (
    <footer className="tone-ink bg-ink text-paper/70">
      <div className="shell">
        <div className="border-t border-rule-dark pt-10 pb-24 sm:pb-10 grid gap-8 md:grid-cols-2">
          <div>
            <p className="font-display text-2xl text-paper-raised">{PERSONAL_INFO.name}</p>
            <p className="mt-1 text-sm">{PERSONAL_INFO.title} · {PERSONAL_INFO.location}</p>
            <SocialIcons source="footer" inverted className="mt-5 gap-3" />
          </div>

          <div className="md:text-right">
            <nav aria-label="Footer">
              <ul className="flex flex-wrap gap-x-5 gap-y-1 md:justify-end">
                {links.map((item) => (
                  <li key={item.to}>
                    <Link to={item.to} className="inline-flex min-h-[32px] items-center text-sm hover:text-paper-raised transition-colors">
                      {item.name}
                    </Link>
                  </li>
                ))}
                <li>
                  <a href={RESUME.path} target="_blank" rel="noopener noreferrer" onClick={() => trackResumeDownload()}
                    className="inline-flex min-h-[32px] items-center text-sm hover:text-paper-raised transition-colors"
                    aria-label="Resume, PDF (opens in a new tab)">
                    Resume <span aria-hidden="true" className="ml-1">↗</span>
                  </a>
                </li>
              </ul>
            </nav>

            <p className="mt-6 text-sm leading-relaxed">
              © {year} {PERSONAL_INFO.fullName}. Built with React, Vite, and Tailwind CSS.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
});

export default Footer;
