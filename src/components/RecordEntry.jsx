import { useState } from 'react';

/** One row in the experience record: logo, organisation and role, dates on the right, details below. */
function RecordEntry({ title, organization, type, duration, location, isCurrent, description, highlights, skills, logo, logoText, logoClassName }) {
  const [logoFailed, setLogoFailed] = useState(false);

  return (
    <li className="group py-9">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
        <div className="grayscale-hover flex h-16 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-rule bg-white p-1 sm:w-24">
          {logo && !logoFailed ? (
            <img src={logo} alt={`${organization} logo`} width="96" height="64" loading="lazy" decoding="async" className={`h-full w-full ${logoClassName || 'object-contain'}`} onError={() => setLogoFailed(true)} />
          ) : (
            <span aria-hidden="true" className="font-mono text-[0.6875rem] text-neutral-500">{logoText}</span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <h3 className="text-[clamp(1.25rem,1rem+0.8vw,1.75rem)] text-ink [@media(hover:hover)]:opacity-90 transition-opacity duration-300 group-hover:opacity-100">
              {organization}
            </h3>
            {isCurrent && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-signal/40 bg-paper-raised px-2.5 py-0.5 font-mono text-[0.6875rem] font-medium text-signal">
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-signal" />
                Current role
              </span>
            )}
          </div>
          <p className="mt-1 text-[0.9375rem] font-medium text-ink-soft">
            {title}
            {type && <span className="text-ink-muted"> · {type}</span>}
          </p>
        </div>
        <div className="w-full sm:w-auto sm:text-right">
          <p className="font-mono text-[0.9375rem] font-semibold leading-tight text-ink">
            {duration}
          </p>
          {location && <p className="text-sm text-ink-muted mt-1">{location}</p>}
        </div>
      </div>

      <div className="min-w-0 sm:pl-[calc(6rem+1.5rem)]">
        {description && (
          <p className="mt-4 max-w-prose text-ink-soft leading-relaxed">{description}</p>
        )}

        {highlights?.length > 0 && (
          <ul className="mt-4 max-w-prose space-y-2 text-[0.9375rem] leading-relaxed text-ink-muted">
            {highlights.map((item) => (
              <li key={item} className="grid grid-cols-[1rem_minmax(0,1fr)]">
                <span aria-hidden="true" className="text-accent-strong">–</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        )}

        {skills?.length > 0 && (
          <p className="stack mt-5">{skills.join(' · ')}</p>
        )}
      </div>
    </li>
  );
}

export default RecordEntry;
