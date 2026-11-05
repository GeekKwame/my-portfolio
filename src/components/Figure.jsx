import { useRef, useState } from 'react';
import { FaExpand, FaTimes } from 'react-icons/fa';

/**
 * Project image with a numbered caption. Clicking opens the full-resolution
 * image in a native <dialog>, which provides focus handling and Escape-to-close.
 */
function Figure({ image, number, compact = false, eager = false }) {
  const dialogRef = useRef(null);
  const [failed, setFailed] = useState(false);

  if (!image || failed) return null;

  const open = () => dialogRef.current?.showModal();
  const close = () => dialogRef.current?.close();
  const isDiagram = image.kind === 'diagram';

  return (
    <figure className="m-0">
      <button
        type="button"
        onClick={open}
        className={`group relative block w-full rounded-xl border border-rule-strong overflow-hidden cursor-zoom-in ${
          isDiagram ? 'bg-white' : 'bg-paper-sunk'
        }`}
        aria-label={`Enlarge figure ${number}: ${image.caption}`}
      >
        <img
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          onError={() => setFailed(true)}
          className={`block w-full h-auto ${isDiagram && !compact ? 'p-3 sm:p-5' : ''}`}
        />
        <span
          aria-hidden="true"
          className="absolute right-3 bottom-3 inline-flex items-center gap-1.5 bg-ink text-paper-raised px-2.5 py-1.5 font-mono text-meta
            opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-150"
        >
          <FaExpand size={10} /> Enlarge
        </span>
      </button>

      {!compact && (
        <figcaption className="mt-3 flex gap-3 text-sm text-ink-muted">
          <span className="font-mono text-meta text-ink shrink-0 pt-px">Fig. {number}</span>
          <span>{image.caption}</span>
        </figcaption>
      )}

      <dialog
        ref={dialogRef}
        onClick={(e) => { if (e.target === dialogRef.current) close(); }}
        className="m-auto max-w-[min(96vw,1600px)] max-h-[94vh] p-0 bg-transparent backdrop:bg-ink/90"
        aria-label={image.caption}
      >
        <div className="relative bg-white">
          <img
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            loading="lazy"
            className="block max-h-[86vh] w-auto h-auto"
          />
          <div className="flex items-center justify-between gap-4 bg-ink text-paper-raised px-4 py-3">
            <p className="text-sm">
              <span className="font-mono text-meta text-accent-light mr-3">Fig. {number}</span>
              {image.caption}
            </p>
            <button
              type="button"
              onClick={close}
              autoFocus
              className="inline-flex items-center gap-2 min-h-[40px] px-3 border border-paper/30 hover:border-paper text-sm focus-visible:outline-paper-raised"
            >
              <FaTimes size={12} aria-hidden="true" /> Close
            </button>
          </div>
        </div>
      </dialog>
    </figure>
  );
}

export default Figure;
