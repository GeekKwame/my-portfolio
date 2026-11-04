import { useState } from 'react';

/**
 * Fixed-ratio preview so cards line up whatever the source image's shape.
 * Images are never cropped; diagrams sit on white because they are drawn for it.
 * A missing or broken image falls back to a typographic panel instead of an empty box.
 */
function ProjectThumb({ project, number, eager = false, className = '' }) {
  const { image } = project;
  const [failed, setFailed] = useState(false);
  const showImage = image && !failed;
  const isDiagram = image?.kind === 'diagram';

  return (
    <div
      className={`relative flex flex-col aspect-[16/10] overflow-hidden border-b border-rule ${
        showImage && isDiagram ? 'bg-[#f3f6f5]' : 'bg-paper-sunk'
      } ${className}`}
    >
      <div
        aria-hidden="true"
        className={`flex items-center justify-between border-b px-4 py-1.5 font-mono text-[0.65rem] uppercase tracking-[0.08em] ${
          showImage && isDiagram
            ? 'border-neutral-300/80 bg-[#e8eeec] text-neutral-700'
            : 'border-rule bg-paper-raised/90 text-ink-muted'
        }`}
      >
        <span>{isDiagram ? 'Architecture & Spatial Plate' : 'Interface Capture'}</span>
        <span>{number ? `FIG. ${number}` : project.category}</span>
      </div>

      {showImage ? (
        <div className="relative flex-1 w-full overflow-hidden">
          <img
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            loading={eager ? 'eager' : 'lazy'}
            decoding="async"
            onError={() => setFailed(true)}
            className={`absolute inset-0 h-full w-full object-contain p-3 transition-transform duration-500 group-hover:scale-[1.02] sm:p-5 ${
              isDiagram ? '' : 'drop-shadow-sm'
            }`}
          />
        </div>
      ) : (
        <div aria-hidden="true" className="flex flex-1 flex-col justify-between p-6">
          <span className="label">{project.category}</span>
          <span className="font-display text-[clamp(2rem,1.4rem+2vw,3rem)] leading-none text-ink/80">{project.shortTitle}</span>
        </div>
      )}
    </div>
  );
}

export default ProjectThumb;
