import { useState } from 'react';

/**
 * Fixed-ratio preview so cards line up whatever the source image's shape.
 * Images are never cropped; diagrams sit on white because they are drawn for it.
 * A missing or broken image falls back to a typographic panel instead of an empty box.
 */
function ProjectThumb({ project, className = '' }) {
  const { image } = project;
  const [failed, setFailed] = useState(false);
  const showImage = image && !failed;
  const isDiagram = image?.kind === 'diagram';

  return (
    <div
      className={`relative aspect-[16/10] overflow-hidden border-b border-rule ${
        showImage && isDiagram ? 'bg-white' : 'bg-paper-sunk'
      } ${className}`}
    >
      {showImage ? (
        <img
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
          className={`h-full w-full object-contain p-4 transition-transform duration-500 group-hover:scale-[1.02] sm:p-6 ${
            isDiagram ? '' : 'drop-shadow-sm'
          }`}
        />
      ) : (
        <div aria-hidden="true" className="flex h-full flex-col justify-between p-6">
          <span className="label">{project.category}</span>
          <span className="font-display text-[clamp(2rem,1.4rem+2vw,3rem)] leading-none text-ink/80">{project.shortTitle}</span>
        </div>
      )}
    </div>
  );
}

export default ProjectThumb;
