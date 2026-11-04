import * as THREE from 'three';

/**
 * Phong sunlight plus atmospheric Fresnel scattering, twilight terminator warmth,
 * and emissive city lights on the unlit hemisphere.
 * The sun is an art-directed fixed direction, not a real-time solar position.
 * Ocean gloss uses a conservative colour mask; it is not elevation data.
 */
export function createEarthMaterial(sunDirection) {
  const uniforms = {
    nightMap: { value: null },
    nightReady: { value: 0 },
    nightView: { value: 0 },
    countryView: { value: 0 },
    sunDirection: { value: sunDirection },
  };
  const material = new THREE.MeshPhongMaterial({
    color: '#ffffff', specular: '#7db4d8', shininess: 44,
  });
  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);
    const varying = 'varying vec3 vEarthNormal; varying vec2 vEarthUv; varying float vEarthFresnel;';
    shader.vertexShader = `${varying}\n${shader.vertexShader}`.replace(
      '#include <begin_vertex>',
      `#include <begin_vertex>
      vEarthNormal = normalize(mat3(modelMatrix) * normal);
      vEarthUv = uv;
      vec3 worldPos = (modelMatrix * vec4(transformed, 1.0)).xyz;
      vec3 viewDir = normalize(cameraPosition - worldPos);
      float ndv = clamp(dot(vEarthNormal, viewDir), 0.0, 1.0);
      float inv = 1.0 - ndv;
      vEarthFresnel = inv * inv * inv;`,
    );
    shader.fragmentShader = `${varying}
      uniform sampler2D nightMap;
      uniform float nightReady, nightView, countryView;
      uniform vec3 sunDirection;
      ${shader.fragmentShader}`
      .replace('#include <map_fragment>', `
        #include <map_fragment>
        float luminance = dot(diffuseColor.rgb, vec3(0.2126, 0.7152, 0.0722));
        diffuseColor.rgb = max(mix(vec3(luminance), diffuseColor.rgb, 1.28), vec3(0.0));
      `)
      .replace('#include <specularmap_fragment>', `
        #include <specularmap_fragment>
        float ocean = smoothstep(0.012, 0.11, diffuseColor.b - max(diffuseColor.r, diffuseColor.g));
        specularStrength *= ocean * (1.0 - nightView * 0.7) * (1.0 - countryView);
      `)
      .replace('#include <opaque_fragment>', `
        float daylight = dot(normalize(vEarthNormal), sunDirection);
        float night = 1.0 - smoothstep(-0.22, 0.16, daylight);
        float twilight = max(0.0, 1.0 - abs(daylight * 4.5)) * smoothstep(-0.35, 0.08, daylight);
        vec3 cities = texture2D(nightMap, vEarthUv).rgb * vec3(1.06, 0.93, 0.76) * nightReady;
        vec3 dayRim = vec3(0.32, 0.76, 0.96) * smoothstep(-0.15, 0.5, daylight);
        vec3 nightRim = vec3(0.12, 0.42, 0.52) * (1.0 - smoothstep(-0.15, 0.3, daylight));
        vec3 terminatorGlow = vec3(0.86, 0.48, 0.24) * twilight * 0.11 * (1.0 - nightView) * (1.0 - countryView);
        vec3 rimGlow = mix(dayRim + nightRim, vec3(0.28, 0.82, 0.62) * 0.55, nightView) * vEarthFresnel * 0.48;
        vec3 dayComposite = outgoingLight + cities * night * 0.92 + terminatorGlow + rimGlow;
        vec3 nightComposite = cities * 1.22 + diffuseColor.rgb * 0.032 + rimGlow;
        outgoingLight = mix(dayComposite, nightComposite, nightView);
        outgoingLight = mix(outgoingLight, diffuseColor.rgb * 0.86 + rimGlow * 0.35, countryView);
        #include <opaque_fragment>
      `);
  };
  material.customProgramCacheKey = () => 'earth-day-night-v3';
  return { material, uniforms };
}
