import * as THREE from 'three';
import ThreeGlobe from 'three-globe';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { HOME_BASE } from '../../config/constants';
import { createEarthMaterial } from './earthMaterial';
import { applyCapStyle, baseCapStyle, findPolygonFeature, forEachPolygonMesh, summarizeCountry } from './countries';

const GREEN = new THREE.Color('#7ee7b4');
const WHITE = new THREE.Color('#ffffff');

/** Owns every WebGL resource and listener. React only receives UI state changes. */
export function createGlobeScene(container, { onStatus, onCountries, onSelection, onMotion }) {
  const motionQuery = matchMedia('(prefers-reduced-motion: reduce)');
  const lowPower = matchMedia('(pointer: coarse)').matches || (navigator.hardwareConcurrency || 8) <= 4;
  // Construct first: unsupported WebGL fails before any library animation or fetch starts.
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: !lowPower, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, lowPower ? 1.25 : 1.75));
  renderer.setClearColor(0x000000, 0);
  const canvas = renderer.domElement;
  canvas.setAttribute('aria-label', 'Earth. Arrow keys rotate; Home returns to Accra.');
  canvas.setAttribute('role', 'img');
  canvas.tabIndex = 0;
  container.appendChild(canvas);

  let destroyed = false;
  let failed = false;
  let visible = false;
  let ready = false;
  let paused = motionQuery.matches;
  let reduced = motionQuery.matches;
  let frame = 0;
  let lastTime = 0;
  let resumeAt = 0;
  let interacting = false;
  let mode = 'day';
  let selected = null;
  let hovered = null;
  let countries = [];
  let countriesPromise = null;
  let pointerStart = null;
  let pendingPointer = null;
  let settleUntil = 0;
  const abort = new AbortController();
  const textures = new Map();
  const loader = new THREE.TextureLoader();
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 1, 1000);
  // three-globe binds scene objects onto data records. Never pass shared constants as layer data.
  const globe = new ThreeGlobe({ animateIn: false, waitForGlobeReady: false })
    .globeCurvatureResolution(lowPower ? 4 : 2.5)
    .atmosphereColor('#83bded').atmosphereAltitude(0.12)
    .pointsData([{ ...HOME_BASE }]).pointLat('lat').pointLng('lng')
    .pointColor(() => '#b5ffdc').pointAltitude(0.018).pointRadius(0.6).pointsTransitionDuration(0)
    .labelsData([{ ...HOME_BASE }]).labelLat('lat').labelLng('lng')
    .labelText('label').labelSize(1.4).labelDotRadius(0.35)
    .labelColor(() => '#d9ffeb').labelAltitude(0.028).labelResolution(2)
    .polygonsData([]).polygonGeoJsonGeometry('geometry').polygonAltitude(0.012)
    .polygonCapCurvatureResolution(7).polygonsTransitionDuration(0)
    .polygonCapColor(() => 'rgba(148,163,184,0.45)')
    .polygonSideColor(() => 'rgba(0,0,0,0.08)')
    .polygonStrokeColor(() => 'rgba(240,250,255,0.4)');
  globe.pauseAnimation(); // No library-owned animation loops; motion is scheduled below.
  scene.add(globe);
  const sunlight = new THREE.Vector3(-0.8, 0.65, 1).normalize();
  const { material, uniforms } = createEarthMaterial(sunlight);
  const previousMaterial = globe.globeMaterial();
  globe.globeMaterial(material);
  previousMaterial.dispose();
  scene.add(new THREE.AmbientLight('#bed8ee', 0.16));
  const sun = new THREE.DirectionalLight('#fff4e6', 2.7);
  sun.position.copy(sunlight).multiplyScalar(500);
  scene.add(sun);

  const clouds = new THREE.Mesh(
    new THREE.SphereGeometry(101, lowPower ? 40 : 64, lowPower ? 24 : 40),
    new THREE.MeshPhongMaterial({ color: '#edf5ff', transparent: true, opacity: 0.48, depthWrite: false }),
  );
  clouds.visible = false;
  globe.add(clouds);
  const pulse = new THREE.Mesh(
    new THREE.RingGeometry(1.0, 1.25, 32),
    new THREE.MeshBasicMaterial({ color: GREEN, transparent: true, opacity: 0.6, side: THREE.DoubleSide, depthWrite: false }),
  );
  const marker = globe.getCoords(HOME_BASE.lat, HOME_BASE.lng, 0.025);
  pulse.position.set(marker.x, marker.y, marker.z);
  pulse.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), pulse.position.clone().normalize());
  globe.add(pulse);

  const home = globe.getCoords(HOME_BASE.lat + 6, HOME_BASE.lng + 9, 2.35);
  camera.position.set(home.x, home.y, home.z);
  const controls = new OrbitControls(camera, canvas);
  controls.enablePan = false;
  controls.enableZoom = false; // Wheel and pinch remain available to the page.
  controls.enableDamping = !reduced;
  controls.dampingFactor = 0.09;
  controls.rotateSpeed = 0.45;
  controls.minPolarAngle = Math.PI * 0.12;
  controls.maxPolarAngle = Math.PI * 0.88;
  controls.update();
  controls.saveState();
  canvas.style.touchAction = 'pan-y pinch-zoom';
  const raycaster = new THREE.Raycaster();
  const ndc = new THREE.Vector2();

  const canRender = () => !destroyed && !failed && visible && !document.hidden;
  function invalidate(settle = 0) {
    settleUntil = Math.max(settleUntil, performance.now() + settle);
    if (canRender() && !frame) frame = requestAnimationFrame(render);
  }
  function loadTexture(url, color = true) {
    if (!textures.has(url)) {
      const entry = { texture: null, promise: null };
      entry.promise = new Promise((resolve, reject) => {
        loader.load(url, (texture) => {
          if (destroyed) { texture.dispose(); resolve(null); return; }
          entry.texture = texture;
          texture.colorSpace = color ? THREE.SRGBColorSpace : THREE.NoColorSpace;
          texture.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
          resolve(texture);
        }, undefined, reject);
      }).catch((error) => { textures.delete(url); throw error; });
      textures.set(url, entry);
    }
    return textures.get(url).promise;
  }

  function styleCountry(feature, color, opacity) {
    if (!feature) return;
    const base = baseCapStyle(feature);
    forEachPolygonMesh(globe, feature, (cap) => applyCapStyle(cap, color || base.color, opacity ?? base.opacity));
  }
  function selectCountry(feature, focus = false) {
    styleCountry(selected);
    selected = feature || null;
    styleCountry(selected, GREEN, 0.75);
    onSelection(selected ? summarizeCountry(selected) : null);
    if (focus && feature) {
      // Camera focus uses the dataset's representative label coordinates.
      const p = feature.properties;
      if (Number.isFinite(p.LABEL_X) && Number.isFinite(p.LABEL_Y)) {
        globe.rotation.y = 0;
        const pos = globe.getCoords(p.LABEL_Y, p.LABEL_X, 2.35);
        controls.reset();
        camera.position.set(pos.x, pos.y, pos.z);
        controls.update();
      }
    }
    resumeAt = performance.now() + 5000;
    invalidate(100);
  }
  async function ensureCountries() {
    if (!countriesPromise) {
      onCountries('loading', []);
      countriesPromise = fetch('/countries.geojson', { signal: abort.signal })
        .then((res) => { if (!res.ok) throw new Error('Country data unavailable'); return res.json(); })
        .then((data) => {
          if (destroyed) return [];
          countries = data.features.filter((f) => f.geometry && f.properties?.ISO_A2 !== 'AQ');
          onCountries('ready', countries.map((f, index) => ({ index, name: summarizeCountry(f).name })).sort((a, b) => a.name.localeCompare(b.name)));
          return countries;
        }).catch(() => {
          countriesPromise = null;
          if (!destroyed) onCountries('error', []);
          return [];
        });
    }
    return countriesPromise;
  }
  async function applyLook(next) {
    mode = next;
    hovered = null;
    selectCountry(null);
    uniforms.nightView.value = next === 'night' ? 1 : 0;
    uniforms.countryView.value = next === 'countries' ? 1 : 0;
    clouds.visible = false;
    globe.polygonsData([]);
    onStatus('ready');
    invalidate(150);
    try {
      if (next === 'clouds') {
        const texture = await loadTexture('/clouds.webp');
        if (destroyed || mode !== next || !texture) return;
        clouds.material.map = texture;
        clouds.material.needsUpdate = true;
        clouds.visible = true;
      }
      if (next === 'night' && !uniforms.nightReady.value) {
        const texture = await loadTexture('/earth-night.webp');
        if (destroyed || !texture) return;
        uniforms.nightMap.value = texture;
        uniforms.nightReady.value = 1;
      }
      if (next === 'countries') {
        const data = await ensureCountries();
        if (destroyed || mode !== next) return;
        globe.polygonsData(data);
        // three-globe batches geometry updates; style once its update has run.
        settleUntil = performance.now() + 300;
      }
      invalidate(300);
    } catch {
      if (!destroyed && mode === next) onStatus('layer-error');
    }
  }
  function pick(x, y) {
    if (mode !== 'countries') return null;
    const rect = canvas.getBoundingClientRect();
    ndc.set((x - rect.left) / rect.width * 2 - 1, -(y - rect.top) / rect.height * 2 + 1);
    raycaster.setFromCamera(ndc, camera);
    // Stop at the opaque Earth: countries on the far side must not be pickable.
    for (const hit of raycaster.intersectObject(globe, true)) {
      const feature = findPolygonFeature(hit.object);
      if (feature) return feature;
      if (hit.object.material === material) break;
    }
    return null;
  }
  function render(time) {
    frame = 0;
    if (!canRender()) return;
    const dt = lastTime ? Math.min((time - lastTime) / 1000, 0.05) : 0;
    // Mobile renders at most 30 fps. Timestamp-based rotation is refresh-rate independent.
    if (lowPower && lastTime && time - lastTime < 1000 / 30 - 1) { invalidate(); return; }
    lastTime = time;
    controls.update(dt);
    const moving = ready && !paused && !reduced && !interacting && time > resumeAt && mode !== 'countries';
    if (moving) {
      globe.rotation.y += dt * 0.035;
      clouds.rotation.y += dt * 0.008;
      const phase = (time % 2400) / 2400;
      pulse.scale.setScalar(1 + phase * 2.2);
      pulse.material.opacity = (1 - phase) * 0.65;
    } else {
      pulse.scale.setScalar(1);
      pulse.material.opacity = 0.5;
    }
    if (pendingPointer && !interacting) {
      const feature = pick(pendingPointer.x, pendingPointer.y);
      pendingPointer = null;
      if (hovered !== feature) {
        if (hovered !== selected) styleCountry(hovered);
        hovered = feature;
        if (hovered !== selected) styleCountry(hovered, WHITE, 0.55);
      }
      canvas.style.cursor = feature ? 'pointer' : 'grab';
    }
    // Reapply after async polygon construction; no geometry rebuilt on hover.
    if (mode === 'countries' && time < settleUntil) {
      countries.forEach((f) => styleCountry(f, f === selected ? GREEN : undefined, f === selected ? 0.75 : undefined));
    }
    globe.setPointOfView(camera);
    renderer.render(scene, camera);
    if ((!paused && !reduced && mode !== 'countries') || time < settleUntil) invalidate();
  }
  function suspend() {
    cancelAnimationFrame(frame);
    frame = 0;
    lastTime = 0;
    globe.pauseAnimation();
  }
  function reset() {
    globe.rotation.y = 0;
    controls.reset();
    resumeAt = performance.now() + 5000;
    invalidate(500);
  }
  function rotate(horizontal, vertical = 0) {
    globe.rotation.y += horizontal;
    const spherical = new THREE.Spherical().setFromVector3(camera.position);
    spherical.phi = THREE.MathUtils.clamp(spherical.phi + vertical, controls.minPolarAngle, controls.maxPolarAngle);
    camera.position.setFromSpherical(spherical);
    controls.update();
    resumeAt = performance.now() + 5000;
    invalidate(500);
  }
  function toggleMotion() {
    paused = !paused;
    onMotion(paused || reduced, reduced);
    invalidate();
  }
  function onMotionChange(event) {
    reduced = event.matches;
    paused = reduced; // Explicit system preference always takes precedence.
    controls.enableDamping = !reduced;
    onMotion(paused, reduced);
    invalidate();
  }
  const onStart = () => { interacting = true; invalidate(); };
  const onEnd = () => { interacting = false; resumeAt = performance.now() + 5000; invalidate(800); };
  const onChange = () => invalidate();
  const onDown = (event) => { pointerStart = { x: event.clientX, y: event.clientY }; };
  const onMove = (event) => { pendingPointer = { x: event.clientX, y: event.clientY }; invalidate(); };
  const onUp = (event) => {
    if (pointerStart && Math.hypot(event.clientX - pointerStart.x, event.clientY - pointerStart.y) < 6 && mode === 'countries') {
      selectCountry(pick(event.clientX, event.clientY));
    }
    pointerStart = null;
  };
  const onLeave = () => { pendingPointer = null; if (hovered !== selected) styleCountry(hovered); hovered = null; invalidate(); };
  const onKey = (event) => {
    const steps = { ArrowLeft: [-0.15, 0], ArrowRight: [0.15, 0], ArrowUp: [0, -0.12], ArrowDown: [0, 0.12] };
    if (steps[event.key]) { event.preventDefault(); rotate(...steps[event.key]); }
    if (event.key === 'Home') { event.preventDefault(); reset(); }
  };
  const onVisibility = () => { if (document.hidden) suspend(); else invalidate(); };
  const onContextLost = (event) => {
    event.preventDefault(); failed = true; suspend(); onStatus('unavailable');
  };
  const listeners = [
    [canvas, 'pointerdown', onDown], [canvas, 'pointermove', onMove],
    [canvas, 'pointerup', onUp], [canvas, 'pointerleave', onLeave],
    [canvas, 'keydown', onKey], [canvas, 'webglcontextlost', onContextLost],
    [document, 'visibilitychange', onVisibility], [motionQuery, 'change', onMotionChange],
  ];
  listeners.forEach(([target, event, fn]) => target.addEventListener(event, fn));
  controls.addEventListener('start', onStart);
  controls.addEventListener('end', onEnd);
  controls.addEventListener('change', onChange);
  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) invalidate(250); else suspend();
  }, { threshold: 0.01 });
  observer.observe(container);
  const resizeObserver = new ResizeObserver(() => {
    const { clientWidth: width, clientHeight: height } = container;
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    invalidate();
  });
  resizeObserver.observe(container);
  onMotion(paused, reduced);
  const loadingTimeout = setTimeout(() => {
    if (!ready && !destroyed) { failed = true; suspend(); onStatus('unavailable'); }
  }, 15000);
  // City lights are composited into the day view. Apply them before "ready", or they pop in
  // after pause and the canvas keeps changing with rotation already stopped.
  const nightPromise = loadTexture('/earth-night.webp').catch(() => null);
  loadTexture('/earth-blue-marble.webp').then(async (texture) => {
    if (destroyed || !texture || failed) return;
    material.map = texture;
    material.needsUpdate = true;
    const night = await nightPromise;
    if (destroyed || failed) return;
    if (night) {
      uniforms.nightMap.value = night;
      uniforms.nightReady.value = 1;
    }
    clearTimeout(loadingTimeout);
    ready = true;
    onStatus('ready');
    invalidate(250);
  }).catch(() => {
    if (!destroyed) { clearTimeout(loadingTimeout); failed = true; suspend(); onStatus('unavailable'); }
  });

  return {
    applyLook, reset, rotate, toggleMotion,
    selectCountry: (index) => selectCountry(countries[index], true),
    clearSelection: () => selectCountry(null),
    destroy() {
      destroyed = true;
      suspend();
      clearTimeout(loadingTimeout);
      abort.abort();
      observer.disconnect();
      resizeObserver.disconnect();
      listeners.forEach(([target, event, fn]) => target.removeEventListener(event, fn));
      controls.dispose();
      // Also stops library layer timers and disposes country geometry no longer attached.
      globe._destructor();
      const geometries = new Set();
      const materials = new Set();
      scene.traverse((obj) => {
        if (obj.geometry) geometries.add(obj.geometry);
        if (obj.material) (Array.isArray(obj.material) ? obj.material : [obj.material]).forEach((m) => materials.add(m));
      });
      geometries.forEach((geometry) => geometry.dispose());
      materials.forEach((m) => {
        // Label sprite textures are library-owned; surface textures are in the cache.
        if (m.map && m !== material) m.map.dispose();
        m.dispose();
      });
      textures.forEach((entry) => entry.texture?.dispose());
      renderer.dispose();
      renderer.forceContextLoss();
      canvas.remove();
    },
  };
}

