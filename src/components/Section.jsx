/**
 * Shared section shell. Every section uses the same two-column grid: a margin
 * column carrying the section number and name (sticky on large screens), and
 * a content column. `aside` renders extra margin content such as a local index.
 * `wide` lets the children span the full width below the heading, for grids
 * that would be cramped inside the content column.
 */
function Section({ id, number, label, title, lede, aside, tone = 'paper', wide = false, children }) {
  const isInk = tone === 'ink';

  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={isInk ? 'tone-ink bg-ink text-paper-raised' : 'border-t border-rule'}
    >
      <div className="shell py-20 sm:py-24 lg:py-32 lg:grid lg:grid-cols-12 lg:gap-x-12">
        <div className="lg:col-span-3 mb-6 lg:mb-0">
          <div className="lg:sticky lg:top-28">
            <p className={`flex items-baseline gap-3 lg:block font-mono text-meta ${isInk ? 'text-paper/70' : 'text-ink-muted'}`}>
              <span className={isInk ? 'text-accent-light' : 'text-accent-strong'}>{number}</span>
              <span className={`lg:block lg:mt-1.5 font-sans text-[0.8125rem] font-bold uppercase tracking-[0.08em] ${isInk ? 'text-paper-raised' : 'text-ink'}`}>
                {label}
              </span>
            </p>
            {aside && <div className="hidden lg:block mt-8">{aside}</div>}
          </div>
        </div>

        <div className="lg:col-span-9 min-w-0">
          <h2
            id={`${id}-title`}
            data-reveal
            className={`section-title max-w-[18ch] ${isInk ? '!text-paper-raised' : ''}`}
          >
            {title}
          </h2>
          {lede && (
            <p className={`lede mt-5 ${isInk ? '!text-paper/75' : ''}`}>{lede}</p>
          )}
          {!wide && <div className="mt-12 sm:mt-14">{children}</div>}
        </div>

        {wide && <div className="lg:col-span-12 mt-12 sm:mt-14 lg:mt-16 min-w-0">{children}</div>}
      </div>
    </section>
  );
}

export default Section;
