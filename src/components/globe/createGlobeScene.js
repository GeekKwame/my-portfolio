import * as THREE from 'three';
import ThreeGlobe from 'three-globe';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { HOME_BASE, ENGINEERING_WAYPOINTS } from '../../config/constants';
import { createEarthMaterial } from './earthMaterial';
import { applyCapStyle, baseCapStyle, countryFocus, findPolygonFeature, forEachPolygonMesh, summarizeCountry } from './countries';

const GREEN = new THREE.Color('#7ee7b4');
const CYAN = new THREE.Color('#67e8f9');
const WHITE = new THREE.Color('#ffffff');

function buildGeodesicArc(globe, from, to, isSelected) {
  const start = globe.getCoords(from.lat, from.lng, 0.018);
  const end = globe.getCoords(to.lat, to.lng, 0.018);
  const vStart = new THREE.Vector3(start.x, start.y, start.z);
  const vEnd = new THREE.Vector3(end.x, end.y, end.z);
  const radius = vStart.length();
  const nStart = vStart.clone().normalize();
  const nEnd = vEnd.clone().normalize();
  const angle = nStart.angleTo(nEnd);
  const peak = Math.min(0.22, Math.max(0.04, angle * 0.2));
  const segments = 20;
  const points = [];
  const q = new THREE.Quaternion().setFromUnitVectors(nStart, nEnd);
  const stepQ = new THREE.Quaternion();
  const ident = new THREE.Quaternion();

  for (let i = 0; i <= segments; i += 1) {
    const t = i / segments;
    stepQ.slerpQuaternions(ident, q, t);
    const dir = nStart.clone().applyQuaternion(stepQ).normalize();
    const alt = 1 + Math.sin(t * Math.PI) * peak;
    points.push(dir.multiplyScalar(radius * alt));
  }

  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({
    color: isSelected ? GREEN : CYAN,
    transparent: true,
    opacity: isSelected ? 0.88 : 0.34,
    depthWrite: false,
  });
  const line = new THREE.Line(geometry, material);
  line.userData.waypointId = to.id;
  return line;
}

/** Owns every WebGL resource and listener. React only receives UI state changes. */
export function createGlobeScene(container, { onStatus, onCountries, onSelection, onMotion, onWaypoint }) {
  const motionQuery = matchMedia('(prefers-reduced-motion: reduce)');
  const baseLowPower = matchMedia('(pointer: coarse)').matches || (navigator.hardwareConcurrency || 8) <= 4;
  // Construct first: unsupported WebGL fails before any library animation or fetch starts.
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: !baseLowPower, powerPreference: 'low-power' });
  const gl = renderer.getContext?.();
  const debugExt = gl?.getExtension?.('WEBGL_debug_renderer_info');
  const glRenderer = String((debugExt ? gl.getParameter(debugExt.UNMASKED_RENDERER_WEBGL) : gl?.getParameter?.(gl.RENDERER)) || '');
  const softwareGl = /SwiftShader|llvmpipe|Software|Subzero/i.test(glRenderer);
  const lowPower = baseLowPower || softwareGl;
  renderer.setPixelRatio(softwareGl ? 1 : Math.min(devicePixelRatio || 1, lowPower ? 1.25 : 1.75));
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
  let countryFlight = null;
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
  const { material, uniforms } = createEarthMaterial(sunlight.clone());
  const previousMaterial = globe.globeMaterial();
  globe.globeMaterial(material);
  previousMaterial.dispose();
  scene.add(new THREE.AmbientLight('#d9eaff', 0.65));
  const sun = new THREE.DirectionalLight('#fff8ee', 3.2);
  sun.position.copy(sunlight).multiplyScalar(500);
  // Keep the key light relative to the viewer as countries come into view.
  camera.add(sun);
  scene.add(camera);

  const clouds = new THREE.Mesh(
    new THREE.SphereGeometry(101, lowPower ? 40 : 64, lowPower ? 24 : 40),
    new THREE.MeshPhongMaterial({ color: '#edf5ff', transparent: true, opacity: 0.48, depthWrite: false }),
  );
  clouds.visible = false;
  globe.add(clouds);
  const pulse = new THREE.Mesh(
    new THREE.RingGeometry(1.0, 1.32, 32),
    new THREE.MeshBasicMaterial({ color: GREEN, transparent: true, opacity: 0.65, side: THREE.DoubleSide, depthWrite: false }),
  );
  function positionSurfaceRing(mesh, lat, lng, altitude = 0.024) {
    const coords = globe.getCoords(lat, lng, altitude);
    mesh.position.set(coords.x, coords.y, coords.z);
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), mesh.position.clone().normalize());
  }
  positionSurfaceRing(pulse, HOME_BASE.lat, HOME_BASE.lng, 0.025);
  globe.add(pulse);

  // Verified engineering footprint: geodesic telemetry arcs and surface markers.
  const footprintGroup = new THREE.Group();
  const waypointArcs = [];
  const waypointDots = [];
  ENGINEERING_WAYPOINTS.forEach((wp) => {
    const dot = new THREE.Mesh(
      new THREE.RingGeometry(wp.isHome ? 0.35 : 0.28, wp.isHome ? 0.72 : 0.58, 16),
      new THREE.MeshBasicMaterial({
        color: wp.isHome ? GREEN : CYAN,
        transparent: true,
        opacity: wp.isHome ? 0.9 : 0.65,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    );
    dot.userData.waypointId = wp.id;
    positionSurfaceRing(dot, wp.lat, wp.lng, 0.02);
    footprintGroup.add(dot);
    waypointDots.push(dot);

    if (!wp.isHome) {
      const arc = buildGeodesicArc(globe, HOME_BASE, wp, false);
      footprintGroup.add(arc);
      waypointArcs.push(arc);
    }
  });
  globe.add(footprintGroup);

  function highlightWaypoint(waypointId) {
    waypointArcs.forEach((arc) => {
      const active = arc.userData.waypointId === waypointId;
      arc.material.color.copy(active ? GREEN : CYAN);
      arc.material.opacity = active ? 0.92 : 0.34;
    });
    waypointDots.forEach((dot) => {
      const active = dot.userData.waypointId === waypointId || (waypointId === 'accra' && dot.userData.waypointId === 'accra');
      dot.material.color.copy(active ? GREEN : CYAN);
      dot.material.opacity = active ? 0.95 : 0.6;
    });
    const target = ENGINEERING_WAYPOINTS.find((w) => w.id === waypointId) || ENGINEERING_WAYPOINTS[0];
    positionSurfaceRing(pulse, target.lat, target.lng, 0.025);
  }

  function focusWaypoint(waypointId) {
    const target = ENGINEERING_WAYPOINTS.find((w) => w.id === waypointId);
    if (!target) return;
    highlightWaypoint(target.id);
    onWaypoint?.(target);
    controls.enableDamping = false;
    controls.update();
    controls.enableDamping = !reduced;
    const latOffset = target.isHome ? target.lat + 6 : target.lat;
    const lngOffset = target.isHome ? target.lng + 9 : target.lng;
    const pos = globe.getCoords(latOffset, lngOffset, 2.35);
    const destination = globe.localToWorld(new THREE.Vector3(pos.x, pos.y, pos.z));
    countryFlight = {
      start: camera.position.clone(),
      turn: new THREE.Quaternion().setFromUnitVectors(camera.position.clone().normalize(), destination.normalize()),
      started: performance.now(),
    };
    resumeAt = performance.now() + 6000;
    invalidate(200);
  }

  const home = globe.getCoords(HOME_BASE.lat + 6, HOME_BASE.lng + 9, 2.35);
  camera.position.set(home.x, home.y, home.z);
  const controls = new OrbitControls(camera, canvas);
  controls.enablePan = false;
  controls.enableZoom = false; // Wheel and pinch remain available to the page.
  controls.enableDamping = !reduced;
  controls.dampingFactor = 0.09;
  controls.rotateSpeed = 0.45;
  controls.minPolarAngle = Math.PI * 0.025;
  controls.maxPolarAngle = Math.PI * 0.975;
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
    countryFlight = null;
    styleCountry(selected);
    selected = feature || null;
    styleCountry(selected, GREEN, 0.95);
    onSelection(selected ? summarizeCountry(selected) : null);
    if (focus && feature) {
      const { lat, lng } = countryFocus(feature);
      if (Number.isFinite(lat) && Number.isFinite(lng)) {
        // Flush residual drag damping before taking over the camera.
        controls.enableDamping = false;
        controls.update();
        controls.enableDamping = !reduced;
        const pos = globe.getCoords(lat, lng, 2.35);
        const destination = globe.localToWorld(new THREE.Vector3(pos.x, pos.y, pos.z));
        countryFlight = {
          start: camera.position.clone(),
          turn: new THREE.Quaternion().setFromUnitVectors(camera.position.clone().normalize(), destination.normalize()),
          started: performance.now(),
        };
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
    footprintGroup.visible = next !== 'countries';
    pulse.visible = next !== 'countries';
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
  function renderNow() {
    if (!canRender()) return;
    cancelAnimationFrame(frame);
    frame = 0;
    controls.update();
    uniforms.sunDirection.value.copy(sun.position).applyQuaternion(camera.quaternion).add(camera.position).normalize();
    pulse.scale.setScalar(1);
    pulse.material.opacity = 0.5;
    globe.setPointOfView(camera);
    renderer.render(scene, camera);
  }
  function render(time) {
    frame = 0;
    if (!canRender()) return;
    const dt = lastTime ? Math.min((time - lastTime) / 1000, 0.05) : 0;
    // Mobile and software rasterizers render at most 30 fps during ambient rotation.
    if (lowPower && !countryFlight && time >= settleUntil && lastTime && time - lastTime < 1000 / 30 - 1) { invalidate(); return; }
    lastTime = time;
    controls.update(dt);
    if (countryFlight) {
      const progress = reduced ? 1 : Math.min((time - countryFlight.started) / 900, 1);
      const eased = progress * progress * (3 - 2 * progress);
      camera.position.copy(countryFlight.start).applyQuaternion(new THREE.Quaternion().slerp(countryFlight.turn, eased));
      controls.update();
      if (progress === 1) countryFlight = null;
    }
    uniforms.sunDirection.value.copy(sun.position).applyQuaternion(camera.quaternion).add(camera.position).normalize();
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
      countries.forEach((f) => styleCountry(f, f === selected ? GREEN : undefined, f === selected ? 0.95 : undefined));
    }
    globe.setPointOfView(camera);
    renderer.render(scene, camera);
    if (countryFlight || (!paused && !reduced && mode !== 'countries') || time < settleUntil) invalidate();
  }
  function suspend() {
    cancelAnimationFrame(frame);
    frame = 0;
    lastTime = 0;
    globe.pauseAnimation();
  }
  function reset() {
    countryFlight = null;
    globe.rotation.y = 0;
    controls.reset();
    highlightWaypoint('accra');
    onWaypoint?.(ENGINEERING_WAYPOINTS[0]);
    resumeAt = performance.now() + 5000;
    if (paused || reduced) {
      settleUntil = 0;
      renderNow();
    } else {
      invalidate(500);
    }
  }
  function rotate(horizontal, vertical = 0) {
    countryFlight = null;
    globe.rotation.y += horizontal;
    const spherical = new THREE.Spherical().setFromVector3(camera.position);
    spherical.phi = THREE.MathUtils.clamp(spherical.phi + vertical, controls.minPolarAngle, controls.maxPolarAngle);
    camera.position.setFromSpherical(spherical);
    controls.update();
    resumeAt = performance.now() + 5000;
    if (paused || reduced) {
      settleUntil = 0;
      renderNow();
    } else {
      invalidate(500);
    }
  }
  function toggleMotion() {
    paused = !paused;
    onMotion(paused || reduced, reduced);
    if (paused || reduced) {
      settleUntil = 0;
      renderNow();
    } else {
      invalidate();
    }
  }
  function onMotionChange(event) {
    reduced = event.matches;
    paused = reduced; // Explicit system preference always takes precedence.
    controls.enableDamping = !reduced;
    onMotion(paused, reduced);
    if (paused) {
      settleUntil = 0;
      renderNow();
    } else {
      invalidate();
    }
  }
  const onStart = () => { countryFlight = null; interacting = true; invalidate(); };
  const onEnd = () => { interacting = false; resumeAt = performance.now() + 5000; invalidate(800); };
  const onChange = () => invalidate();
  const onDown = (event) => { pointerStart = { x: event.clientX, y: event.clientY }; };
  const onMove = (event) => { pendingPointer = { x: event.clientX, y: event.clientY }; invalidate(); };
  const onUp = (event) => {
    if (pointerStart && Math.hypot(event.clientX - pointerStart.x, event.clientY - pointerStart.y) < 6 && mode === 'countries') {
      selectCountry(pick(event.clientX, event.clientY), true);
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
    applyLook, reset, rotate, toggleMotion, focusWaypoint,
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
