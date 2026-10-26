import * as THREE from 'three';

const CONTINENT_COLORS = {
  Africa: new THREE.Color('#4ade80'),
  Asia: new THREE.Color('#fbbf24'),
  Europe: new THREE.Color('#60a5fa'),
  'North America': new THREE.Color('#f87171'),
  'South America': new THREE.Color('#c084fc'),
  Oceania: new THREE.Color('#2dd4bf'),
  Antarctica: new THREE.Color('#e2e8f0'),
};

export function formatPopulation(n) {
  if (n == null || Number.isNaN(Number(n))) return null;
  const value = Number(n);
  if (value >= 1e9) return `${(value / 1e9).toFixed(1)}B`;
  if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
  if (value >= 1e3) return `${(value / 1e3).toFixed(0)}K`;
  return String(Math.round(value));
}

export function summarizeCountry(feature) {
  const p = feature?.properties || {};
  return {
    name: p.NAME || p.ADMIN || 'Unknown',
    continent: p.CONTINENT || null,
    population: formatPopulation(p.POP_EST),
    iso: p.ISO_A2 && p.ISO_A2 !== '-99' ? p.ISO_A2 : null,
  };
}

export function findPolygonFeature(object) {
  let current = object;
  while (current) {
    if (current.__globeObjType === 'polygon' && current.__data) {
      return current.__data.data || null;
    }
    current = current.parent;
  }
  return null;
}

export function forEachPolygonMesh(Globe, feature, fn) {
  Globe.traverse((obj) => {
    if (obj.__globeObjType !== 'polygon' || obj.__data?.data !== feature) return;
    const mesh = obj.children?.[0];
    const cap = Array.isArray(mesh?.material) ? mesh.material[1] : null;
    if (cap) fn(cap);
  });
}

export function baseCapStyle(feature) {
  const continent = feature?.properties?.CONTINENT;
  return {
    color: CONTINENT_COLORS[continent] || new THREE.Color('#94a3b8'),
    opacity: 0.45,
  };
}

export function applyCapStyle(cap, color, opacity) {
  cap.transparent = true;
  cap.depthWrite = false;
  cap.color.copy(color);
  cap.opacity = opacity;
  cap.needsUpdate = true;
}

