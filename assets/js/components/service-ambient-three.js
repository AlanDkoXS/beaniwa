/**
 * Ambient particle stream rendered with Three.js (WebGL points), ported from
 * the ParticleSystem in the "Card Beam Animation" pen and tinted to the brand
 * orange. Loaded lazily by service-scanner.js; Three.js comes from a pinned CDN
 * build so it never weighs on pages without the services section.
 */

const THREE_URL = 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.min.js';

const POINT_SIZE = 15;

/**
 * Build the point sprite: tiny white core, orange halo, transparent edge.
 * @param {typeof import('three')} THREE
 */
function createSpriteTexture(THREE) {
  const size = 100;
  const half = size / 2;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const g = ctx.createRadialGradient(half, half, 0, half, half, half);
  // Fade the halo by alpha, never by darkness: a dark opaque halo shows up
  // as a black disc once the canvas is composited over a non-black page.
  g.addColorStop(0, 'rgba(255, 255, 255, 1)');
  g.addColorStop(0.04, 'rgba(255, 220, 180, 1)');
  g.addColorStop(0.12, 'rgba(250, 110, 2, 0.55)');
  g.addColorStop(0.3, 'rgba(250, 110, 2, 0.12)');
  g.addColorStop(1, 'rgba(250, 110, 2, 0)');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(half, half, half, 0, Math.PI * 2);
  ctx.fill();
  return new THREE.CanvasTexture(canvas);
}

/**
 * Create the WebGL ambient layer.
 * @param {HTMLCanvasElement} canvas
 * @param {{ width: number, height: number, count: number, dpr: number }} options
 * @returns {Promise<{ resize: Function, render: Function, destroy: Function }>}
 */
export async function createThreeAmbient(canvas, { width, height, count, dpr }) {
  const THREE = await import(THREE_URL);

  let w = width;
  const h = height;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(dpr);
  renderer.setSize(w, h, false);
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-w / 2, w / 2, h / 2, -h / 2, 1, 1000);
  camera.position.z = 100;

  const positions = new Float32Array(count * 3);
  const alphas = new Float32Array(count);
  const velocities = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * w * 2;
    positions[i * 3 + 1] = (Math.random() - 0.5) * h;
    positions[i * 3 + 2] = 0;
    alphas[i] = (Math.random() * 8 + 2) / 10;
    velocities[i] = Math.random() * 60 + 30;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('alpha', new THREE.BufferAttribute(alphas, 1));

  const texture = createSpriteTexture(THREE);
  const material = new THREE.ShaderMaterial({
    uniforms: {
      pointTexture: { value: texture },
      size: { value: POINT_SIZE * dpr },
    },
    vertexShader: `
      attribute float alpha;
      varying float vAlpha;
      uniform float size;
      void main() {
        vAlpha = alpha;
        gl_PointSize = size;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D pointTexture;
      varying float vAlpha;
      void main() {
        vec4 tex = texture2D(pointTexture, gl_PointCoord);
        float a = tex.a * vAlpha;
        // Premultiplied output: pure additive light, transparent where faint
        gl_FragColor = vec4(tex.rgb * a, a);
      }
    `,
    transparent: true,
    blending: THREE.CustomBlending,
    blendEquation: THREE.AddEquation,
    blendSrc: THREE.OneFactor,
    blendDst: THREE.OneFactor,
    depthWrite: false,
  });

  const points = new THREE.Points(geometry, material);
  scene.add(points);

  let time = 0;

  return {
    /**
     * @param {number} newWidth - CSS px
     */
    resize(newWidth) {
      w = newWidth;
      camera.left = -w / 2;
      camera.right = w / 2;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    },

    /**
     * @param {number} dt - seconds since last frame
     * @param {number} step - frame step normalised to 60fps
     */
    render(dt, step) {
      time += dt;
      const edge = w / 2 + 100;
      for (let i = 0; i < count; i++) {
        positions[i * 3] += velocities[i] * dt;
        if (positions[i * 3] > edge) {
          positions[i * 3] = -edge;
          positions[i * 3 + 1] = (Math.random() - 0.5) * h;
        }
        positions[i * 3 + 1] += Math.sin(time + i * 0.1) * 0.5 * step;

        const twinkle = Math.floor(Math.random() * 10);
        if (twinkle === 1) alphas[i] -= 0.05 * step;
        else if (twinkle === 2) alphas[i] += 0.05 * step;
        alphas[i] = Math.max(0, Math.min(1, alphas[i]));
      }
      geometry.attributes.position.needsUpdate = true;
      geometry.attributes.alpha.needsUpdate = true;
      renderer.render(scene, camera);
    },

    destroy() {
      scene.remove(points);
      geometry.dispose();
      material.dispose();
      texture.dispose();
      renderer.dispose();
    },
  };
}
