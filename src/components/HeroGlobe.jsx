import { memo, useLayoutEffect, useRef, useState } from 'react';
import { createGlobeScene } from './globe/createGlobeScene';
import GlobeFallback from './globe/GlobeFallback';

const LOOKS = [
  { id: 'day', label: 'True colour' }, { id: 'night', label: 'Night' },
  { id: 'clouds', label: 'Clouds' }, { id: 'countries', label: 'Countries' },
];

const HeroGlobe = memo(function HeroGlobe() {
  const containerRef = useRef(null);
  const apiRef = useRef(null);
  const [status, setStatus] = useState('loading');
  const [look, setLook] = useState('day');
  const [selection, setSelection] = useState(null);
  const [countries, setCountries] = useState({ status: 'idle', items: [] });
  const [motion, setMotion] = useState({ paused: false, reduced: false });

  // OrbitControls removes document listeners via getRootNode(). Dispose before React detaches the canvas.
  useLayoutEffect(() => {
    let active = true;
    try {
      apiRef.current = createGlobeScene(containerRef.current, {
        onStatus: (value) => { if (active) setStatus(value); },
        onSelection: (value) => { if (active) setSelection(value); },
        onCountries: (state, items) => { if (active) setCountries({ status: state, items }); },
        onMotion: (paused, reduced) => { if (active) setMotion({ paused, reduced }); },
      });
    } catch {
      // Defer state update out of synchronous effect setup, including StrictMode's trial mount.
      queueMicrotask(() => { if (active) setStatus('unavailable'); });
    }
    return () => { active = false; apiRef.current?.destroy(); apiRef.current = null; };
  }, []);

  const unavailable = status === 'unavailable';
  const ready = status === 'ready' || status === 'layer-error';
  function changeLook(id) {
    setLook(id);
    apiRef.current?.applyLook(id);
  }

  return (
    <div className="globe-experience">
      <div className="globe-caption" aria-hidden="true">
        <span>Our shared perspective</span><span>01 / Earth</span>
      </div>
      <div className="hero-globe-stage relative mx-auto aspect-square w-full">
        {!ready && <GlobeFallback message={unavailable ? 'A quieter view of our world.' : 'Preparing the Earth…'} />}
        <div ref={containerRef} className={`globe-canvas ${ready ? 'is-ready' : ''}`} aria-hidden={!ready} inert={!ready ? '' : undefined} />
      </div>
      <div className="globe-location">
        <span className="globe-location-dot" aria-hidden="true" />
        <span>Accra, Ghana</span><span className="text-ink-muted">5.60° N / 0.19° W</span>
      </div>
      {unavailable ? (
        <p className="mt-4 text-center text-sm text-ink-muted" role="status">Interactive Earth is unavailable. You can still explore all my work below.</p>
      ) : (
        <>
          <div className="globe-looks" role="group" aria-label="Globe appearance">
            {LOOKS.map((item) => (
              <button key={item.id} type="button" disabled={!ready} aria-pressed={look === item.id}
                onClick={() => changeLook(item.id)}>{item.label}</button>
            ))}
          </div>
          <div className="globe-controls" role="group" aria-label="Earth controls">
            <button type="button" disabled={!ready} onClick={() => apiRef.current?.rotate(-0.2)} aria-label="Rotate Earth left">←</button>
            <button type="button" disabled={!ready || motion.reduced || look === 'countries'} aria-pressed={motion.paused || look === 'countries'}
              onClick={() => apiRef.current?.toggleMotion()}>
              {motion.reduced ? 'Reduced motion' : look === 'countries' ? 'Rotation held' : motion.paused ? 'Resume rotation' : 'Pause rotation'}
            </button>
            <button type="button" disabled={!ready} onClick={() => apiRef.current?.reset()}>Reset view</button>
            <button type="button" disabled={!ready} onClick={() => apiRef.current?.rotate(0.2)} aria-label="Rotate Earth right">→</button>
          </div>
          <p className="mt-2 text-center text-xs text-ink-muted">Drag sideways or use arrow keys to explore.</p>
          {look === 'countries' && (
            <div className="mt-4">
              <label htmlFor="globe-country" className="sr-only">Explore a country</label>
              <select id="globe-country" className="globe-select" disabled={countries.status !== 'ready'}
                value={selection ? countries.items.find((c) => c.name === selection.name)?.index ?? '' : ''}
                onChange={(event) => event.target.value === '' ? apiRef.current?.clearSelection() : apiRef.current?.selectCountry(Number(event.target.value))}>
                <option value="">{countries.status === 'loading' ? 'Loading countries…' : countries.status === 'error' ? 'Country data unavailable' : 'Explore a country'}</option>
                {countries.items.map((country) => <option key={country.index} value={country.index}>{country.name}</option>)}
              </select>
              {countries.status === 'error' && <button type="button" className="link min-h-[44px]" onClick={() => changeLook('countries')}>Retry countries</button>}
            </div>
          )}
          <div className="globe-status" role="status">
            {status === 'layer-error' ? <p>This layer could not load. Choose it again to retry.</p> : selection ? (
              <p><strong className="text-ink">{selection.name}</strong>{selection.continent && ` · ${selection.continent}`}
                {selection.population && ` · Population estimate ${selection.population}`}
                <button type="button" className="ml-2 min-h-[44px] underline" onClick={() => apiRef.current?.clearSelection()}>Clear</button>
              </p>
            ) : look === 'countries' ? <p>Select a country on the globe or from the list.</p> : null}
          </div>
        </>
      )}
    </div>
  );
});
export default HeroGlobe;
