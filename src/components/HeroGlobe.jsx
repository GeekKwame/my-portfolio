import { memo, useEffect, useRef, useState } from 'react';
import ThreeGlobe from 'three-globe';
import * as THREE from 'three';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js';
import { HOME_BASE } from '../config/constants';

const CLOUDS_ALT = 0.004;
const CLOUDS_ROTATION_SPEED = 0.006;
const POLY_ALT = 0.01;
const HOME_MARKER = [HOME_BASE];
const HOME_POINT_COLOR = '#15803d';

const LOOKS = [
  { id: 'day', label: 'True colour' },
  { id: 'night', label: 'Night' },
  { id: 'clouds', label: 'Clouds' },
  { id: 'countries', label: 'Countries' },
];

const CONTINENT_COLORS = {
  Africa: new THREE.Color('#4ade80'),
  Asia: new THREE.Color('#fbbf24'),
  Europe: new THREE.Color('#60a5fa'),
  'North America': new THREE.Color('#f87171'),
  'South America': new THREE.Color('#c084fc'),
  Oceania: new THREE.Color('#2dd4bf'),
  Antarctica: new THREE.Color('#e2e8f0'),
};

const SELECTED_COLOR = new THREE.Color('#22c55e');
const HOVER_COLOR = new THREE.Color('#ffffff');

function buildArcs(count = 5) {
  const colors = ['#a3a3a3', '#737373', '#525252'];
  return Array.from({ length: count }, () => ({
    startLat: (Math.random() - 0.5) * 140,
    startLng: (Math.random() - 0.5) * 320,
    endLat: (Math.random() - 0.5) * 140,
    endLng: (Math.random() - 0.5) * 320,
    color: colors[Math.floor(Math.random() * colors.length)],
  }));
}

function formatPopulation(n) {
  if (n == null || Number.isNaN(Number(n))) return null;
  const value = Number(n);
  if (value >= 1e9) return `${(value / 1e9).toFixed(1)}B`;
  if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
  if (value >= 1e3) return `${(value / 1e3).toFixed(0)}K`;
  return String(Math.round(value));
}

function summarizeCountry(feature) {
  const p = feature?.properties || {};
  return {
    name: p.NAME || p.ADMIN || 'Unknown',
    continent: p.CONTINENT || null,
    population: formatPopulation(p.POP_EST),
    iso: p.ISO_A2 && p.ISO_A2 !== '-99' ? p.ISO_A2 : null,
  };
}

function findPolygonFeature(object) {
  let current = object;
  while (current) {
    if (current.__globeObjType === 'polygon' && current.__data) {
      return current.__data.data || null;
    }
    current = current.parent;
  }
  return null;
}

function forEachPolygonMesh(Globe, feature, fn) {
  Globe.traverse((obj) => {
    if (obj.__globeObjType !== 'polygon' || obj.__data?.data !== feature) return;
    const mesh = obj.children?.[0];
    const cap = Array.isArray(mesh?.material) ? mesh.material[1] : null;
    if (cap) fn(cap);
  });
}

function baseCapStyle(feature) {
  const continent = feature?.properties?.CONTINENT;
  return {
    color: CONTINENT_COLORS[continent] || new THREE.Color('#94a3b8'),
    opacity: 0.45,
  };
}

function applyCapStyle(cap, color, opacity) {
  cap.transparent = true;
  cap.depthWrite = false;
  cap.color.copy(color);
  cap.opacity = opacity;
  cap.needsUpdate = true;
}

/**
 * Interactive globe for the hero: look modes + country picking.
 * Paints polygon materials in place — no geometry rebuild on hover.
 */
const HeroGlobe = memo(function HeroGlobe({ className = '' }) {
  const containerRef = useRef(null);
  const apiRef = useRef(null);

  const [look, setLook] = useState('day');
  const [selected, setSelected] = useState(null);
  const [countriesReady, setCountriesReady] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let cancelled = false;
    let frameId = 0;
    let visible = true;
    let countriesPromise = null;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const textureLoader = new THREE.TextureLoader();
    const pointer = { downX: 0, downY: 0, dragging: false };
    const hoverRef = { current: null };
    const selectedRef = { current: null };
    const lookRef = { current: 'day' };
    const pendingPointer = { x: 0, y: 0, dirty: false };

    const arcsData = buildArcs();
    const Globe = new ThreeGlobe({ animateIn: !reduceMotion })
      .globeImageUrl('/earth-blue-marble.webp')
      .arcsData([])
      .arcColor('color')
      .arcDashLength(0.35)
      .arcDashGap(5)
      .arcDashInitialGap(() => Math.random() * 5)
      .arcDashAnimateTime(reduceMotion ? 0 : 1400)
      .arcsTransitionDuration(0)
      .pointsData(HOME_MARKER)
      .pointLat('lat')
      .pointLng('lng')
      .pointColor(() => HOME_POINT_COLOR)
      .pointAltitude(0.012)
      .pointRadius(0.55)
      .pointsMerge(false)
      .ringsData(reduceMotion ? [] : HOME_MARKER)
      .ringLat('lat')
      .ringLng('lng')
      .ringColor(() => (t) => `rgba(21,128,61,${Math.max(0, 1 - t)})`)
      .ringMaxRadius(2.8)
      .ringPropagationSpeed(1.1)
      .ringRepeatPeriod(1600)
      .labelsData(HOME_MARKER)
      .labelLat('lat')
      .labelLng('lng')
      .labelText((d) => d.label)
      .labelSize(1.55)
      .labelDotRadius(0.4)
      .labelColor(() => HOME_POINT_COLOR)
      .labelAltitude(0.018)
      .labelResolution(2)
      .polygonsData([])
      .polygonGeoJsonGeometry('geometry')
      .polygonAltitude(POLY_ALT)
      .polygonCapCurvatureResolution(9)
      .polygonsTransitionDuration(0)
      .polygonCapColor(() => 'rgba(148,163,184,0.45)')
      .polygonSideColor(() => 'rgba(0,0,0,0.12)')
      .polygonStrokeColor(() => 'rgba(255,255,255,0.3)');

    const clouds = new THREE.Mesh(
      new THREE.SphereGeometry(Globe.getGlobeRadius() * (1 + CLOUDS_ALT), 32, 32),
    );
    clouds.visible = false;
    let cloudsLoaded = false;
    Globe.add(clouds);

    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(1.5, window.devicePixelRatio || 1));
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.touchAction = 'none';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.add(Globe);
    scene.add(new THREE.AmbientLight(0xcccccc, Math.PI));
    scene.add(new THREE.DirectionalLight(0xffffff, 0.55 * Math.PI));

    const camera = new THREE.PerspectiveCamera();
    // Frame Accra on first paint (three-globe has no pointOfView — that's globe.gl)
    const homeCam = Globe.getCoords(HOME_BASE.lat, HOME_BASE.lng, 2.15);
    camera.position.set(homeCam.x, homeCam.y, homeCam.z);
    camera.lookAt(0, 0, 0);

    const controls = new TrackballControls(camera, renderer.domElement);
    controls.target.set(0, 0, 0);
    controls.minDistance = 220;
    controls.maxDistance = 520;
    controls.rotateSpeed = 4;
    controls.zoomSpeed = 0.7;
    controls.noPan = true;
    controls.staticMoving = true;
    controls.dynamicDampingFactor = 0.15;
    controls.update();

    const raycaster = new THREE.Raycaster();
    raycaster.params.Line = { threshold: 0.2 };
    const pointerNdc = new THREE.Vector2();

    const ensureClouds = () => {
      if (cloudsLoaded) return;
      cloudsLoaded = true;
      textureLoader.load('/clouds.webp', (texture) => {
        if (cancelled) return;
        texture.anisotropy = 1;
        clouds.material = new THREE.MeshBasicMaterial({
          map: texture,
          transparent: true,
          opacity: 0.75,
          depthWrite: false,
        });
      });
    };

    const ensureCountries = () => {
      if (countriesPromise) return countriesPromise;
      countriesPromise = fetch('/countries.geojson')
        .then((res) => res.json())
        .then((geojson) => {
          if (cancelled) return [];
          const countries = (geojson.features || []).filter((d) => d.properties?.ISO_A2 !== 'AQ');
          api.countries = countries;
          setCountriesReady(true);
          return countries;
        })
        .catch(() => {
          setCountriesReady(true);
          return [];
        });
      return countriesPromise;
    };

    const restoreCap = (feature) => {
      if (!feature) return;
      const style = baseCapStyle(feature);
      forEachPolygonMesh(Globe, feature, (cap) => applyCapStyle(cap, style.color, style.opacity));
    };

    const highlightCap = (feature, color, opacity) => {
      if (!feature) return;
      forEachPolygonMesh(Globe, feature, (cap) => applyCapStyle(cap, color, opacity));
    };

    const showCountriesLayer = async () => {
      const countries = await ensureCountries();
      if (cancelled || lookRef.current !== 'countries') return;
      Globe.polygonsData(countries);

      const ghana = countries.find((f) => f.properties?.ISO_A2 === HOME_BASE.iso);
      requestAnimationFrame(() => {
        if (selectedRef.current) {
          highlightCap(selectedRef.current, SELECTED_COLOR, 0.7);
          return;
        }
        if (ghana) {
          selectedRef.current = ghana;
          highlightCap(ghana, SELECTED_COLOR, 0.7);
          setSelected(summarizeCountry(ghana));
        }
      });
    };

    const applyLook = (lookId) => {
      lookRef.current = lookId;
      const showClouds = lookId === 'clouds';
      const showArcs = lookId === 'night';
      const showCountries = lookId === 'countries';

      if (lookId === 'night') {
        Globe.globeImageUrl('/earth-night.webp').bumpImageUrl(null);
      } else if (lookId === 'countries') {
        Globe.globeImageUrl('/earth-dark.jpg').bumpImageUrl(null);
      } else {
        Globe.globeImageUrl('/earth-blue-marble.webp').bumpImageUrl(null);
      }

      Globe.arcsData(showArcs ? arcsData : []);

      if (showClouds) {
        ensureClouds();
        clouds.visible = true;
      } else {
        clouds.visible = false;
      }

      if (showCountries) {
        showCountriesLayer();
      } else {
        Globe.polygonsData([]);
        hoverRef.current = null;
      }
    };

    const api = {
      Globe,
      clouds,
      lookRef,
      hoverRef,
      selectedRef,
      countries: [],
      applyLook,
      ensureCountries,
    };
    apiRef.current = api;

    let width = 0;
    let height = 0;
    const resize = () => {
      const nextWidth = container.clientWidth;
      const nextHeight = container.clientHeight;
      if (!nextWidth || !nextHeight || (nextWidth === width && nextHeight === height)) return;
      width = nextWidth;
      height = nextHeight;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    resize();

    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { threshold: 0.05 },
    );
    visibilityObserver.observe(container);

    const pickFeature = (clientX, clientY) => {
      if (lookRef.current !== 'countries' || !api.countries.length) return null;
      const rect = renderer.domElement.getBoundingClientRect();
      pointerNdc.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      pointerNdc.y = -((clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointerNdc, camera);
      const hits = raycaster.intersectObjects(Globe.children, true);
      for (const hit of hits) {
        const feature = findPolygonFeature(hit.object);
        if (feature) return feature;
      }
      return null;
    };

    const onPointerDown = (event) => {
      pointer.downX = event.clientX;
      pointer.downY = event.clientY;
      pointer.dragging = false;
    };

    const onPointerMove = (event) => {
      if (
        Math.abs(event.clientX - pointer.downX) > 5
        || Math.abs(event.clientY - pointer.downY) > 5
      ) {
        pointer.dragging = true;
      }

      if (lookRef.current !== 'countries') {
        renderer.domElement.style.cursor = 'grab';
        return;
      }
      pendingPointer.x = event.clientX;
      pendingPointer.y = event.clientY;
      pendingPointer.dirty = true;
    };

    const processPendingHover = () => {
      if (!pendingPointer.dirty || lookRef.current !== 'countries') return;
      pendingPointer.dirty = false;
      const feature = pickFeature(pendingPointer.x, pendingPointer.y);
      renderer.domElement.style.cursor = feature ? 'pointer' : 'grab';
      if (feature === hoverRef.current) return;

      if (hoverRef.current && hoverRef.current !== selectedRef.current) {
        restoreCap(hoverRef.current);
      }
      hoverRef.current = feature;
      if (feature && feature !== selectedRef.current) {
        highlightCap(feature, HOVER_COLOR, 0.4);
      }
    };

    const onPointerUp = (event) => {
      if (pointer.dragging) return;
      if (lookRef.current !== 'countries') return;

      const feature = pickFeature(event.clientX, event.clientY);
      if (selectedRef.current && selectedRef.current !== feature) {
        restoreCap(selectedRef.current);
      }
      selectedRef.current = feature;
      if (feature) {
        highlightCap(feature, SELECTED_COLOR, 0.7);
        setSelected(summarizeCountry(feature));
      } else {
        setSelected(null);
      }
    };

    const onPointerLeave = () => {
      pendingPointer.dirty = false;
      if (hoverRef.current && hoverRef.current !== selectedRef.current) {
        restoreCap(hoverRef.current);
      }
      hoverRef.current = null;
      renderer.domElement.style.cursor = 'grab';
    };

    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    renderer.domElement.addEventListener('pointermove', onPointerMove);
    renderer.domElement.addEventListener('pointerup', onPointerUp);
    renderer.domElement.addEventListener('pointerleave', onPointerLeave);

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      if (!visible) return;
      controls.update();
      processPendingHover();
      if (!reduceMotion && clouds.visible) {
        clouds.rotation.y += (CLOUDS_ROTATION_SPEED * Math.PI) / 180;
      }
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelled = true;
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      renderer.domElement.removeEventListener('pointermove', onPointerMove);
      renderer.domElement.removeEventListener('pointerup', onPointerUp);
      renderer.domElement.removeEventListener('pointerleave', onPointerLeave);
      controls.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
      Globe.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          const materials = Array.isArray(obj.material) ? obj.material : [obj.material];
          materials.forEach((material) => {
            if (material.map) material.map.dispose();
            if (material.bumpMap) material.bumpMap.dispose();
            material.dispose();
          });
        }
      });
      apiRef.current = null;
    };
  }, []);

  const handleLookChange = (lookId) => {
    setLook(lookId);
    const api = apiRef.current;
    if (!api) return;
    if (lookId !== 'countries') {
      setSelected(null);
      api.selectedRef.current = null;
      api.hoverRef.current = null;
    }
    api.applyLook(lookId);
  };

  const clearSelection = () => {
    setSelected(null);
    const api = apiRef.current;
    if (!api?.selectedRef.current) return;
    const feature = api.selectedRef.current;
    api.selectedRef.current = null;
    if (api.lookRef.current === 'countries') {
      const style = baseCapStyle(feature);
      forEachPolygonMesh(api.Globe, feature, (cap) => applyCapStyle(cap, style.color, style.opacity));
    }
  };

  const homeLine = `Based in ${HOME_BASE.city}, ${HOME_BASE.country}`;
  const hint =
    look === 'countries'
      ? (countriesReady ? `${homeLine} · click another country` : 'Loading countries…')
      : `${homeLine} · drag to explore`;

  return (
    <div className={`relative w-full ${className}`}>
      <div className="hero-globe-stage relative mx-auto aspect-square w-full">
        <div
          ref={containerRef}
          className="relative z-[1] h-full w-full cursor-grab overflow-hidden rounded-full active:cursor-grabbing"
          role="img"
          aria-label={`Interactive 3D Earth centred on ${HOME_BASE.city}, ${HOME_BASE.country}. Drag to explore. Switch to Countries to select a country.`}
        />
      </div>

      <div
        className="mt-5 flex flex-wrap items-end justify-center gap-x-1 border-b border-rule"
        role="toolbar"
        aria-label="Globe appearance"
      >
        {LOOKS.map((item) => {
          const active = look === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleLookChange(item.id)}
              className={`min-h-[40px] px-3 py-2 text-[0.6875rem] font-semibold uppercase tracking-[0.1em] transition-colors border-b-2 -mb-px ${
                active
                  ? 'border-ink text-ink'
                  : 'border-transparent text-ink-muted hover:text-ink'
              }`}
              aria-pressed={active}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      <div className="mt-3 min-h-[1.25rem] text-center text-meta text-ink-muted" aria-live="polite">
        {selected ? (
          <p>
            <span className="font-semibold text-ink">{selected.name}</span>
            {selected.iso ? <span className="font-mono text-ink-faint"> · {selected.iso}</span> : null}
            {selected.continent ? <span> · {selected.continent}</span> : null}
            {selected.population ? <span> · {selected.population}</span> : null}
            <button
              type="button"
              onClick={clearSelection}
              className="ml-2 text-ink-muted underline-offset-2 hover:text-ink hover:underline"
            >
              Clear
            </button>
          </p>
        ) : (
          <p>{hint}</p>
        )}
      </div>
    </div>
  );
});

export default HeroGlobe;
