import { memo } from 'react';
import { PERSONAL_INFO, SECTION_INDEX } from '../config/constants';
import SocialIcons from './SocialIcon';

const Footer = memo(function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="tone-ink bg-ink text-paper/70">
      <div className="shell">
        <div className="border-t border-rule-dark pt-10 pb-24 sm:pb-10 grid gap-8 md:grid-cols-2">
          <div>
            <p className="text-sm text-paper-raised/40">© {year} {PERSONAL_INFO.name}.</p>
            <SocialIcons source="footer" inverted className="mt-4 gap-3" />
          </div>

          <div className="md:text-right">
            <p className="text-paper-raised/40 transition-opacity hover:text-paper-raised/80">{PERSONAL_INFO.location}.</p>
            <a
              href={`mailto:${PERSONAL_INFO.email}`}
              className="mt-1 inline-block break-all text-paper-raised/40 transition-colors hover:text-paper-raised/80"
            >
              {PERSONAL_INFO.email}
            </a>

            <nav aria-label="Footer" className="mt-6">
              <ul className="flex flex-wrap gap-x-5 gap-y-1 md:justify-end">
                {SECTION_INDEX.map((item) => (
                  <li key={item.to}>
                    <a href={`#${item.to}`} className="inline-flex min-h-[32px] items-center text-sm hover:text-paper-raised transition-colors">
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <p className="mt-4 text-sm leading-relaxed">
              Designed and built by {PERSONAL_INFO.name} with React, Vite, and Tailwind CSS.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
});

export default Footer;
