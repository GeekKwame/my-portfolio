import { useState, memo } from 'react';
import { FaCopy, FaCheck } from 'react-icons/fa';
import Section from './Section';
import { trackSocialClick, trackResumeDownload } from '../utils/analytics';
import { PERSONAL_INFO, SOCIAL_LINKS, RESUME } from '../config/constants';
import { useToastContext } from '../context/ToastContext';

const Contact = memo(function Contact() {
  const [copied, setCopied] = useState(false);
  const { success } = useToastContext();
  const linkedin = SOCIAL_LINKS.find((link) => link.platform === 'LinkedIn');
  const github = SOCIAL_LINKS.find((link) => link.platform === 'GitHub');

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(PERSONAL_INFO.email);
      setCopied(true);
      trackSocialClick('email_copy');
      success('Email address copied');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${PERSONAL_INFO.email}`;
    }
  };

  const channels = [
    { name: 'LinkedIn', detail: linkedin.handle, href: linkedin.url, onClick: () => trackSocialClick('linkedin_contact') },
    { name: 'GitHub', detail: github.handle, href: github.url, onClick: () => trackSocialClick('github_contact') },
    { name: 'Resume', detail: 'PDF', href: RESUME.path, onClick: () => trackResumeDownload() },
  ];

  return (
    <Section
      id="contact"
      number="05"
      label="Contact"
      tone="ink"
      title="Hiring for backend, cloud, or platform work? Let’s talk."
      lede={`${PERSONAL_INFO.availability} Based in ${PERSONAL_INFO.location} (${PERSONAL_INFO.timezone}), open to remote work.`}
    >
      <p className="label !text-paper/70">Email is the fastest way to reach me</p>
      <div className="mt-3 flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-6">
        <a
          href={`mailto:${PERSONAL_INFO.email}`}
          onClick={() => trackSocialClick('email_contact')}
          className="font-display text-paper-raised text-[clamp(1.375rem,0.9rem+2.3vw,2.5rem)] leading-tight break-all
            underline decoration-paper/30 decoration-1 underline-offset-[6px] hover:text-accent-light hover:decoration-accent-light transition-colors"
        >
          {PERSONAL_INFO.email}
        </a>
        <button
          type="button"
          onClick={copyEmail}
          className="btn self-start sm:self-auto shrink-0 !min-h-[40px] !px-4 !text-sm border border-paper/40 text-paper-raised hover:border-paper-raised hover:bg-paper-raised hover:text-ink"
          aria-label={copied ? 'Email address copied' : 'Copy email address'}
        >
          {copied ? <FaCheck size={11} aria-hidden="true" /> : <FaCopy size={11} aria-hidden="true" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>

      <ul className="mt-14 max-w-2xl border-t border-rule-dark">
        {channels.map((channel) => (
          <li key={channel.name} className="border-b border-rule-dark">
            <a
              href={channel.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={channel.onClick}
              className="group grid grid-cols-[6rem_minmax(0,1fr)_auto] items-baseline gap-4 py-4 min-h-[44px]"
            >
              <span className="text-paper-raised group-hover:text-accent-light transition-colors">{channel.name}</span>
              <span className="font-mono text-meta text-paper/65 truncate">
                <span className="sr-only"> </span>{channel.detail}<span className="sr-only"> (opens in a new tab)</span>
              </span>
              <span aria-hidden="true" className="text-paper/65 group-hover:text-accent-light group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">↗</span>
            </a>
          </li>
        ))}
      </ul>
    </Section>
  );
});

export default Contact;
