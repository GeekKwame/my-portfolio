/** Same dimensions during loading, static rendering, and WebGL failure. */
export default function GlobeFallback({ message = 'Earth · Accra, Ghana' }) {
  return (
    <div className="globe-fallback" role="img" aria-label="Earth, with Africa facing forward. Based in Accra, Ghana.">
      <div className="globe-fallback-sphere" />
      <p className="globe-loading-note">{message}</p>
    </div>
  );
}
