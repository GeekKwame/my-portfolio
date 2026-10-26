import * as THREE from 'three';

/** Phong sunlight plus emissive city lights on the unlit hemisphere.
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
    color: '#ffffff', specular: '#57778b', shininess: 28,
  });
  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);
    const varying = 'varying vec3 vEarthNormal; varying vec2 vEarthUv;';
    shader.vertexShader = `${varying}\n${shader.vertexShader}`.replace(
      '#include <begin_vertex>',
      '#include <begin_vertex>\nvEarthNormal = normalize(mat3(modelMatrix) * normal); vEarthUv = uv;',
    );
    shader.fragmentShader = `${varying}
      uniform sampler2D nightMap;
      uniform float nightReady, nightView, countryView;
      uniform vec3 sunDirection;
      ${shader.fragmentShader}`
      .replace('#include <specularmap_fragment>', `
        #include <specularmap_fragment>
        float ocean = smoothstep(0.015, 0.12, diffuseColor.b - max(diffuseColor.r, diffuseColor.g));
        specularStrength *= ocean * (1.0 - nightView) * (1.0 - countryView);
      `)
      .replace('#include <opaque_fragment>', `
        float daylight = dot(normalize(vEarthNormal), sunDirection);
        float night = 1.0 - smoothstep(-0.2, 0.15, daylight);
        vec3 cities = texture2D(nightMap, vEarthUv).rgb * nightReady;
        outgoingLight = mix(outgoingLight + cities * night * 0.85, cities * 1.15 + diffuseColor.rgb * 0.025, nightView);
        outgoingLight = mix(outgoingLight, diffuseColor.rgb * 0.4, countryView);
        #include <opaque_fragment>
      `);
  };
  material.customProgramCacheKey = () => 'earth-day-night-v1';
  return { material, uniforms };
}
