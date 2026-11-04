import { memo, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createGlobeScene } from './globe/createGlobeScene';
import GlobeFallback from './globe/GlobeFallback';
import Link from './Link';
import { ENGINEERING_WAYPOINTS } from '../config/constants';

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
  const [activeWaypoint, setActiveWaypoint] = useState(ENGINEERING_WAYPOINTS[0]);

  // OrbitControls removes document listeners via getRootNode(). Dispose before React detaches the canvas.
  useLayoutEffect(() => {
    let active = true;
    try {
      apiRef.current = createGlobeScene(containerRef.current, {
        onStatus: (value) => { if (active) setStatus(value); },
        onSelection: (value) => { if (active) setSelection(value); },
        onCountries: (state, items) => { if (active) setCountries({ status: state, items }); },
        onMotion: (paused, reduced) => { if (active) setMotion({ paused, reduced }); },
        onWaypoint: (wp) => { if (active && wp) setActiveWaypoint(wp); },
      });
    } catch {
      // Defer state update out of synchronous effect setup, including StrictMode's trial mount.
      queueMicrotask(() => { if (active) setStatus('unavailable'); });
    }
    return () => { active = false; apiRef.current?.destroy(); apiRef.current = null; };
  }, []);

  useEffect(() => {
    const onExternalFocus = (event) => {
      const id = event.detail?.waypointId;
      if (id && apiRef.current) {
        if (look === 'countries') {
          setLook('day');
          apiRef.current.applyLook('day');
        }
        apiRef.current.focusWaypoint(id);
      }
    };
    window.addEventListener('globe:focus-waypoint', onExternalFocus);
    return () => window.removeEventListener('globe:focus-waypoint', onExternalFocus);
  }, [look]);

  const unavailable = status === 'unavailable';
  const ready = status === 'ready' || status === 'layer-error';
  function changeLook(id) {
    setLook(id);
    apiRef.current?.applyLook(id);
  }
  function selectWaypoint(id) {
    if (look === 'countries') {
      setLook('day');
      apiRef.current?.applyLook('day');
    }
    apiRef.current?.focusWaypoint(id);
  }

  return (
    <div className="globe-experience">
      <div className="globe-caption" aria-hidden="true">
        <span>Engineering telemetry · Geodesic view</span><span>01 / Earth</span>
      </div>
      <div className="hero-globe-stage relative mx-auto aspect-square w-full">
        {!ready && <GlobeFallback message={unavailable ? 'A quieter view of our world.' : 'Preparing the Earth…'} />}
        <div ref={containerRef} className={`globe-canvas ${ready ? 'is-ready' : ''}`} aria-hidden={!ready} inert={!ready ? '' : undefined} />
      </div>
      <div className="globe-location">
        <span className="globe-location-dot" aria-hidden="true" />
        <span className="font-medium text-ink">{activeWaypoint.title.split(' · ')[0]}</span>
        <span className="font-mono text-[0.72rem] text-ink-muted">{activeWaypoint.coords}</span>
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
          <p className="mt-1.5 text-center text-xs text-ink-muted">Drag sideways or use arrow keys to explore.</p>

          {look !== 'countries' && (
            <div className="mt-3 rounded-xl border border-rule bg-paper-raised p-3">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-ink-muted">Footprint waypoints</span>
                <span className="font-mono text-[0.6875rem] text-accent-strong">{activeWaypoint.role}</span>
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5" role="group" aria-label="Engineering footprint waypoints">
                {ENGINEERING_WAYPOINTS.map((wp) => {
                  const isCurrent = activeWaypoint.id === wp.id;
                  return (
                    <button
                      key={wp.id}
                      type="button"
                      disabled={!ready}
                      aria-pressed={isCurrent}
                      onClick={() => selectWaypoint(wp.id)}
                      className={`min-h-[34px] rounded-lg border px-2.5 py-1 font-mono text-[0.6875rem] font-medium transition-colors ${
                        isCurrent
                          ? 'border-ink bg-ink text-paper'
                          : 'border-rule-strong bg-paper text-ink-muted hover:border-ink/50 hover:text-ink'
                      }`}
                    >
                      {wp.shortLabel}
                    </button>
                  );
                })}
              </div>
              <div className="mt-2.5 border-t border-rule pt-2.5 text-xs leading-relaxed text-ink-soft">
                <p>{activeWaypoint.summary}</p>
                <div className="mt-1.5 flex flex-wrap items-center justify-between gap-2">
                  <span className="font-mono text-[0.6875rem] text-ink-muted">{activeWaypoint.stack}</span>
                  <Link to={activeWaypoint.href} className="link font-medium text-ink">
                    {activeWaypoint.linkLabel} <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
            </div>
          )}

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
