/**
 * Service Card Scanner Effect
 *
 * Infinite horizontal carousel of service cards with a dual-beam scanner,
 * based on the "Card Beam Animation" pen (codepen.io/blacklead-studio/pen/xbwaqxE).
 *
 * Two beams sit at the edges of the strip's fade mask:
 *   - LEFT  of the left beam  → ASCII visible
 *   - CENTER (between beams)  → normal card visible
 *   - RIGHT of the right beam → ASCII visible
 *
 * Like the pen, each beam has an idle state and a "scanning" state (a card is
 * crossing it). While scanning, the beam glow flares, particles spawn faster,
 * travel further and grow, and the vertical fade tightens. Every value eases
 * between the two states, so the light breathes as cards pass through.
 */

import { createThreeAmbient } from './service-ambient-three.js';

// ─── Tuning ──────────────────────────────────────────────────────────────────

const CHAR_WIDTH = 6;
const LINE_HEIGHT = 12;
const FONT_SIZE = 10;

/** Width of the beam hit area used for clipping and scan detection (px) */
const SCAN_WIDTH = 8;
/** Visual width of the white beam core (px) */
const LIGHT_BAR_WIDTH = 3;

const IDLE = {
  intensity: 0.8,
  glow: 1,
  fadeZone: 60,
};

const SCANNING = {
  intensity: 1.8,
  glow: 3.5,
  fadeZone: 35,
};

/** Per-beam particle caps. The pen uses 800 / 2500 for a single beam. */
const PARTICLES_IDLE = 400;
const PARTICLES_SCANNING = 1200;

/** Easing factor per 60fps frame between idle and scanning values */
const TRANSITION_SPEED = 0.05;

/** Cruise speed after a drag release (px/s) */
const BASE_VELOCITY = 80;
const MIN_VELOCITY = 30;
const FRICTION = 0.95;

/** Only flash a card if it entered the beam within this many px */
const FLASH_ENTRY_WINDOW = 30;

/** Ambient drifting particles behind the cards (the pen's Three.js layer) */
const AMBIENT_COUNT_DESKTOP = 400;
const AMBIENT_COUNT_MIN = 120;
const AMBIENT_REFERENCE_WIDTH = 1440;
const AMBIENT_BAND_HEIGHT = 250;
const AMBIENT_SPRITE_SIZE = 15;

const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
const randomFloat = (min, max) => Math.random() * (max - min) + min;

// ─── ASCII Code Generator ────────────────────────────────────────────────────

const CODE_LIBRARY = [
  'const initWebDev = async () => {',
  '  const stack = ["React", "Next.js", "Node"];',
  '  return await buildSite({ stack, seo: true });',
  '};',
  'function optimizeSEO(keywords = []) {',
  '  const index = crawlSite();',
  '  keywords.forEach(k => rank(index, k));',
  '  return generateReport(index);',
  '}',
  'class BrandingEngine {',
  '  constructor({ palette, typography }) {',
  '    this.colors = palette;',
  '    this.fonts = typography;',
  '  }',
  '  render() { return this.compose(this.colors); }',
  '  export(fmt = "svg") { return convert(this, fmt); }',
  '}',
  'const socialMedia = {',
  '  platforms: ["Instagram", "Facebook", "TikTok"],',
  '  schedule: (post) => queue.push(post),',
  '  analyze: () => fetchMetrics("30d"),',
  '  engage: async (post) => await reply(post.comments),',
  '};',
  'async function deployApp(config) {',
  '  const bundle = await compile(config.entry);',
  '  await upload(bundle, config.target);',
  '  const id = await publish(bundle.hash);',
  '  return monitor(id, { alerts: true });',
  '}',
  'export class Campaign {',
  '  constructor(brand) { this.brand = brand; }',
  '  launch() { return run(this.strategy()); }',
  '  strategy() { return optimize(this.brand.goals); }',
  '}',
  'const ROI = (inv, earn) =>',
  '  ((earn - inv) / inv * 100).toFixed(2) + "%";',
  'const leads = pipeline',
  '  .filter(l => l.score > 70)',
  '  .map(qualify);',
  'const ctr = (clicks, views) =>',
  '  (clicks / views * 100).toFixed(1) + "%";',
  'if (brand.reach < target.reach) {',
  '  amplify(brand, budget);',
  '}',
  'const kpis = {',
  '  ctr: 0.04, cvr: 0.023,',
  '  roas: 4.8, cpc: 0.35,',
  '};',
  'const funnel = steps =>',
  '  steps.reduce((acc, fn) => fn(acc), leads);',
  'const api = new RestClient({',
  '  baseURL: "https://api.beaniwa.com/v1",',
  '});',
  'const analytics = await api.get("/metrics", {',
  '  period: "month",',
  '});',
  'const copy = await generateCopy({',
  '  tone: "professional",',
  '  lang,',
  '});',
  'function abTest(variants, metric) {',
  '  return variants',
  '    .map(v => measure(v, metric))',
  '    .sort(desc);',
  '}',
  'const seo = {',
  '  audit: (url) => lighthouse(url),',
  '  keywords: (niche) => research(niche, {',
  '    vol: ">1000",',
  '  }),',
  '  backlinks: async (domain) =>',
  '    await fetchLinks(domain),',
  '};',
  'const brand = await Aniwa.grow({',
  '  name: "beaniwa",',
  '  market: "digital",',
  '  goal: "triple-sales",',
  '});',
];

/**
 * Returns a block of themed code to fill an ASCII card overlay.
 * Starts at a random offset so every refresh actually looks different.
 * @param {number} cols - character columns
 * @param {number} rows - character rows
 * @returns {string}
 */
function generateServiceCode(cols = 60, rows = 20) {
  const base = CODE_LIBRARY.join(' ').replace(/\s+/g, ' ');
  const needed = cols * rows;
  let flow = base.slice(Math.floor(Math.random() * base.length));
  while (flow.length < needed) flow += ' ' + base;

  let out = '';
  for (let row = 0; row < rows; row++) {
    out += flow.slice(row * cols, (row + 1) * cols) + (row < rows - 1 ? '\n' : '');
  }
  return out;
}

// ─── ServiceCarousel ─────────────────────────────────────────────────────────

class ServiceCarousel {
  /**
   * @param {HTMLElement} section - the .services element
   * @param {{ title: string, body: string, iconClass: string }[]} cardData
   */
  constructor(section, cardData) {
    this.section = section;
    this.cardData = cardData;

    // Carousel motion
    this.position = 0;
    this.velocity = BASE_VELOCITY;
    this.direction = -1;
    this.isAnimating = true;
    this.isDragging = false;
    this.lastMouseX = 0;
    this.mouseVelocity = 0;
    this.lastTime = 0;

    // Measured dimensions (CSS is the source of truth)
    this.cardWidth = 0;
    this.cardHeight = 0;
    this.cardGap = 0;
    this.loopPeriod = 0;
    this.containerWidth = 0;

    // Canvas (drawn in CSS px, backed at devicePixelRatio)
    this.canvas = null;
    this.ctx = null;
    this.dpr = 1;
    this.width = 0;
    this.height = 0;
    this.gradientCache = null;

    this.beamTopY = 0;
    this.beamBottomY = 0;
    this.beams = {
      left: this.createBeamState(-1),
      right: this.createBeamState(1),
    };
    this.particles = [];

    // Ambient layer behind the cards
    this.ambientCanvas = null;
    this.ambientCtx = null;
    this.ambientSprite = null;
    this.ambientParticles = [];
    this.ambientWidth = 0;
    this.ambientTime = 0;
    this.ambientTop = 0;
    this.threeAmbient = null;
    this.destroyed = false;

    this.rafId = null;
    this.intervalId = null;
    this.isVisible = true;
    this.resizeObserver = null;
    this.visibilityObserver = null;

    this.init();
  }

  /**
   * @param {1|-1} sign - direction particles travel away from the beam
   */
  createBeamState(sign) {
    return {
      sign,
      x: 0,
      scanning: false,
      intensity: IDLE.intensity,
      glow: IDLE.glow,
      fadeZone: IDLE.fadeZone,
      maxParticles: PARTICLES_IDLE,
      count: 0,
    };
  }

  init() {
    this.buildStrip();
    this.createCanvas();
    this.createAmbientCanvas();
    this.createGradientCache();
    this.createAmbientSprite();
    this.measure();
    this.fillAscii();
    this.seedParticles();

    this.onDragHandler = e => this.onDrag(e);
    this.endDragHandler = () => this.endDrag();
    this.onTouchDragHandler = e => this.onDrag(e.touches[0]);
    this.setupEvents();
    this.setupObservers();

    this.start();
    this.intervalId = setInterval(() => this.updateAsciiContent(), 200);
    this.loadThreeAmbient();
  }

  // ── Strip Construction ──────────────────────────────────────────────────────

  buildStrip() {
    const old = this.section.querySelector('.scanner-strip-container');
    if (old) old.remove();

    const container = document.createElement('div');
    container.className = 'scanner-strip-container';
    container.setAttribute('aria-hidden', 'true');

    const strip = document.createElement('div');
    strip.className = 'scanner-strip';

    // Enough full sets of cards to cover the viewport plus one loop period,
    // so wrapping by exactly one period is seamless.
    const n = this.cardData.length;
    const approxCard = 490;
    const viewport = Math.max(window.innerWidth, window.screen?.width || 0);
    const sets = Math.max(2, Math.ceil(viewport / (approxCard * n)) + 1);
    for (let i = 0; i < n * sets; i++) {
      strip.appendChild(this.createCardWrapper(this.cardData[i % n]));
    }

    container.appendChild(strip);

    const grid = this.section.querySelector('.services-grid');
    const btn = this.section.querySelector('.btn');
    if (grid) this.section.insertBefore(container, grid);
    else if (btn) this.section.insertBefore(container, btn);
    else this.section.appendChild(container);

    this.strip = strip;
    this.container = container;
    this.wrappers = Array.from(strip.children);
  }

  createCardWrapper(data) {
    const wrapper = document.createElement('div');
    wrapper.className = 'scanner-card-wrapper';

    const normal = document.createElement('div');
    normal.className = 'scanner-card-normal';

    const h2 = document.createElement('h2');
    if (data.iconClass) {
      const icon = document.createElement('span');
      icon.className = 'service-card-icon ' + data.iconClass;
      icon.setAttribute('aria-hidden', 'true');
      h2.appendChild(icon);
    }
    h2.appendChild(document.createTextNode(data.title));

    const p = document.createElement('p');
    p.textContent = data.body;
    normal.appendChild(h2);
    normal.appendChild(p);
    wrapper.appendChild(normal);

    // Two ASCII layers: one revealed left of the left beam, one right of the right beam
    ['left', 'right'].forEach(side => {
      const layer = document.createElement('div');
      layer.className = `scanner-card-ascii scanner-card-ascii-${side}`;
      const content = document.createElement('div');
      content.className = `ascii-content ascii-content--${side}`;
      content.style.fontSize = FONT_SIZE + 'px';
      content.style.lineHeight = LINE_HEIGHT + 'px';
      layer.appendChild(content);
      wrapper.appendChild(layer);
    });

    return wrapper;
  }

  /**
   * Read card size and gap from the rendered DOM so JS never drifts from CSS.
   */
  measure() {
    const first = this.wrappers[0];
    if (first) {
      this.cardWidth = first.offsetWidth || 450;
      this.cardHeight = first.offsetHeight || 300;
    }
    const gap = parseFloat(getComputedStyle(this.strip).columnGap);
    this.cardGap = Number.isFinite(gap) ? gap : 40;
    this.loopPeriod = (this.cardWidth + this.cardGap) * this.cardData.length;
    this.containerWidth = this.container.offsetWidth;
    this.resizeCanvas();
  }

  asciiSize() {
    return {
      cols: Math.ceil(this.cardWidth / CHAR_WIDTH) + 2,
      rows: Math.ceil(this.cardHeight / LINE_HEIGHT) + 1,
    };
  }

  fillAscii() {
    const { cols, rows } = this.asciiSize();
    this.strip.querySelectorAll('.ascii-content').forEach(el => {
      el.textContent = generateServiceCode(cols, rows);
    });
  }

  /** Refresh a random subset of visible ASCII blocks for a live-terminal feel */
  updateAsciiContent() {
    if (!this.isVisible) return;
    const { cols, rows } = this.asciiSize();
    this.strip.querySelectorAll('.ascii-content').forEach(el => {
      if (Math.random() < 0.15) el.textContent = generateServiceCode(cols, rows);
    });
  }

  // ── Canvas ──────────────────────────────────────────────────────────────────

  createCanvas() {
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'serviceScannerCanvas';
    this.canvas.setAttribute('aria-hidden', 'true');
    // Inline positioning so the canvas never affects layout, even before
    // service-scanner.css is applied (head sync race on back/forward).
    this.canvas.style.position = 'absolute';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.pointerEvents = 'none';
    this.ctx = this.canvas.getContext('2d');
    this.section.appendChild(this.canvas);
  }

  resizeCanvas() {
    const w = this.section.offsetWidth;
    const h = this.section.offsetHeight;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.width = w;
    this.height = h;
    this.canvas.width = Math.round(w * this.dpr);
    this.canvas.height = Math.round(h * this.dpr);
    this.canvas.style.width = w + 'px';
    this.canvas.style.height = h + 'px';
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);

    const sectionRect = this.section.getBoundingClientRect();
    const cRect = this.container.getBoundingClientRect();
    const containerLeft = cRect.left - sectionRect.left;

    // Beams sit where the CSS edge mask reaches full opacity (6% / 94%)
    const fadeFrac = 0.06;
    this.beams.left.x = containerLeft + cRect.width * fadeFrac;
    this.beams.right.x = containerLeft + cRect.width * (1 - fadeFrac);

    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    this.beamTopY = cRect.top - sectionRect.top - rem;
    this.beamBottomY = cRect.bottom - sectionRect.top + rem;

    this.resizeAmbient(cRect.top - sectionRect.top + cRect.height / 2);
  }

  // ── Ambient Particles ───────────────────────────────────────────────────────

  createAmbientCanvas() {
    const canvas = document.createElement('canvas');
    canvas.className = 'service-ambient-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    canvas.style.position = 'absolute';
    canvas.style.left = '0';
    canvas.style.pointerEvents = 'none';
    this.ambientCanvas = canvas;
    this.ambientCtx = canvas.getContext('2d');
    this.section.appendChild(canvas);
  }

  /**
   * Swap the 2D ambient layer for the Three.js (WebGL) version once it loads.
   * The 2D layer keeps running meanwhile, and stays if WebGL or the CDN fails.
   */
  async loadThreeAmbient() {
    const canvas = document.createElement('canvas');
    canvas.className = 'service-ambient-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    canvas.style.position = 'absolute';
    canvas.style.left = '0';
    canvas.style.pointerEvents = 'none';

    try {
      const three = await createThreeAmbient(canvas, {
        width: this.width,
        height: AMBIENT_BAND_HEIGHT,
        count: this.ambientParticles.length,
        dpr: this.dpr,
      });
      if (this.destroyed) {
        three.destroy();
        return;
      }
      this.ambientCanvas.replaceWith(canvas);
      this.ambientCanvas = canvas;
      this.threeAmbient = three;
      this.resizeAmbient(this.ambientTop);
    } catch (error) {
      console.warn('Three.js ambient particles unavailable, using 2D fallback', error);
    }
  }

  /**
   * Same shape as the pen's point texture (tiny white core, soft halo),
   * tinted to the brand orange.
   */
  createAmbientSprite() {
    const size = 100;
    const half = size / 2;
    const sprite = document.createElement('canvas');
    sprite.width = size;
    sprite.height = size;
    const ctx = sprite.getContext('2d');
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
    this.ambientSprite = sprite;
  }

  /**
   * Fit the ambient band to the strip's vertical center and rescale the
   * particle count to the section width (fewer particles on phones).
   * @param {number} centerY - strip center, relative to the section
   */
  resizeAmbient(centerY) {
    const w = this.width;
    const h = AMBIENT_BAND_HEIGHT;
    const canvas = this.ambientCanvas;
    this.ambientTop = centerY;

    if (this.threeAmbient) {
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      canvas.style.top = centerY - h / 2 + 'px';
      this.threeAmbient.resize(w);
      return;
    }

    canvas.width = Math.round(w * this.dpr);
    canvas.height = Math.round(h * this.dpr);
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    canvas.style.top = centerY - h / 2 + 'px';
    this.ambientCtx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);

    const scaled = Math.round(AMBIENT_COUNT_DESKTOP * (w / AMBIENT_REFERENCE_WIDTH));
    const count = clamp(scaled, AMBIENT_COUNT_MIN, AMBIENT_COUNT_DESKTOP);
    const list = this.ambientParticles;
    if (list.length > count) list.length = count;
    while (list.length < count) {
      list.push({
        // Spread across two widths so the stream is already full on load
        x: randomFloat(-w * 0.5, w * 1.5),
        y: randomFloat(0, h),
        speed: randomFloat(30, 90),
        alpha: randomFloat(0.2, 1),
        phase: list.length * 0.1,
      });
    }
    this.ambientWidth = w;
  }

  /**
   * Drift particles right with a slow vertical wave and random twinkle,
   * mirroring the pen's ParticleSystem.animate().
   * @param {number} dt - seconds since last frame
   * @param {number} step - frame step normalised to 60fps
   */
  renderAmbient(dt, step) {
    if (this.threeAmbient) {
      this.threeAmbient.render(dt, step);
      return;
    }
    const ctx = this.ambientCtx;
    const w = this.ambientWidth;
    const h = AMBIENT_BAND_HEIGHT;
    const size = AMBIENT_SPRITE_SIZE;
    const half = size / 2;
    this.ambientTime += dt;

    ctx.globalCompositeOperation = 'source-over';
    ctx.clearRect(0, 0, w, h);
    ctx.globalCompositeOperation = 'lighter';

    this.ambientParticles.forEach(p => {
      p.x += p.speed * dt;
      if (p.x > w + 100) {
        p.x = -100;
        p.y = randomFloat(0, h);
      }
      p.y += Math.sin(this.ambientTime + p.phase) * 0.5 * step;
      if (p.y < 0) p.y += h;
      else if (p.y > h) p.y -= h;

      const twinkle = Math.random() * 10;
      if (twinkle < 1) p.alpha -= 0.05 * step;
      else if (twinkle < 2) p.alpha += 0.05 * step;
      p.alpha = clamp(p.alpha, 0, 1);

      if (p.alpha <= 0 || p.x < -half || p.x > w + half) return;
      ctx.globalAlpha = p.alpha;
      ctx.drawImage(this.ambientSprite, p.x - half, p.y - half, size, size);
    });
  }

  /** Pre-rendered particle sprite: white core fading into brand orange */
  createGradientCache() {
    const gc = document.createElement('canvas');
    gc.width = 16;
    gc.height = 16;
    const ctx = gc.getContext('2d');
    const half = 8;
    const g = ctx.createRadialGradient(half, half, 0, half, half, half);
    g.addColorStop(0, 'rgba(255, 255, 255, 1)');
    g.addColorStop(0.3, 'rgba(255, 190, 120, 0.8)');
    g.addColorStop(0.7, 'rgba(250, 110, 2, 0.4)');
    g.addColorStop(1, 'transparent');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(half, half, half, 0, Math.PI * 2);
    ctx.fill();
    this.gradientCache = gc;
  }

  // ── Particles ───────────────────────────────────────────────────────────────

  /**
   * Spawn a particle at a beam. Speed, size, decay and twinkle scale with the
   * beam's current intensity, exactly like the pen's createParticle().
   * @param {'left'|'right'} side
   */
  createParticle(side) {
    const beam = this.beams[side];
    const ratio = beam.intensity / IDLE.intensity;
    const speedMul = 1 + (ratio - 1) * 1.2;
    const sizeMul = 1 + (ratio - 1) * 0.7;
    const alpha = randomFloat(0.6, 1);

    beam.count++;
    return {
      side,
      x: beam.x + randomFloat(-LIGHT_BAR_WIDTH / 2, LIGHT_BAR_WIDTH / 2),
      y: randomFloat(this.beamTopY, this.beamBottomY),
      vx: randomFloat(0.2, 1.0) * speedMul * beam.sign,
      vy: randomFloat(-0.15, 0.15) * speedMul,
      radius: randomFloat(0.4, 1) * sizeMul,
      alpha,
      originalAlpha: alpha,
      decay: randomFloat(0.005, 0.025) * (2 - ratio * 0.5),
      life: 1,
      time: 0,
      twinkleSpeed: randomFloat(0.02, 0.08) * speedMul,
      twinkleAmount: randomFloat(0.1, 0.25),
    };
  }

  seedParticles() {
    for (let i = 0; i < PARTICLES_IDLE; i++) {
      this.particles.push(this.createParticle('left'));
      this.particles.push(this.createParticle('right'));
    }
  }

  /**
   * Advance and draw every particle. Dead particles are respawned, or
   * removed when their beam is above its current cap.
   * @param {number} step - frame step normalised to 60fps
   */
  updateAndDrawParticles(step) {
    const ctx = this.ctx;
    const top = this.beamTopY;
    const bottom = this.beamBottomY;
    const w = this.width;

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx * step;
      p.y += p.vy * step;
      p.time += step;
      p.alpha = p.originalAlpha * p.life + Math.sin(p.time * p.twinkleSpeed) * p.twinkleAmount;
      p.life -= p.decay * step;

      if (p.life <= 0 || p.x < -10 || p.x > w + 10) {
        const beam = this.beams[p.side];
        beam.count--;
        if (beam.count >= beam.maxParticles) {
          this.particles.splice(i, 1);
        } else {
          this.particles[i] = this.createParticle(p.side);
        }
        continue;
      }

      if (p.y < top || p.y > bottom) continue;
      const fz = this.beams[p.side].fadeZone;
      let fade = 1;
      if (p.y < top + fz) fade = (p.y - top) / fz;
      else if (p.y > bottom - fz) fade = (bottom - p.y) / fz;

      ctx.globalAlpha = clamp(p.alpha, 0, 1) * clamp(fade, 0, 1);
      ctx.drawImage(this.gradientCache, p.x - p.radius, p.y - p.radius, p.radius * 2, p.radius * 2);
    }
  }

  /**
   * Spawn new particles. Like the pen, extra spawn chances unlock as the
   * intensity ratio rises, which makes the beam visibly "boil" while scanning.
   * @param {'left'|'right'} side
   */
  spawnParticles(side) {
    const beam = this.beams[side];
    if (beam.count >= beam.maxParticles) return;
    const ratio = beam.intensity / IDLE.intensity;
    const chances = [
      [0, beam.intensity],
      [1.1, (ratio - 1.0) * 1.2],
      [1.3, (ratio - 1.3) * 1.4],
      [1.5, (ratio - 1.5) * 1.8],
      [2.0, (ratio - 2.0) * 2.0],
    ];
    chances.forEach(([threshold, chance]) => {
      if (ratio > threshold && Math.random() < chance && beam.count < beam.maxParticles) {
        this.particles.push(this.createParticle(side));
      }
    });
  }

  // ── Beam Drawing ────────────────────────────────────────────────────────────

  /**
   * Fill a full-height rounded bar with a horizontal gradient.
   */
  fillBar(x, halfWidth, radius, stops, alpha) {
    const ctx = this.ctx;
    const g = ctx.createLinearGradient(x - halfWidth, 0, x + halfWidth, 0);
    stops.forEach(([offset, color]) => g.addColorStop(offset, color));
    ctx.globalAlpha = alpha;
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.roundRect(x - halfWidth, this.beamTopY, halfWidth * 2, this.beamBottomY - this.beamTopY, radius);
    ctx.fill();
  }

  /**
   * Draw one beam. Glow alphas are multiplied by the eased glow intensity
   * (1 idle → 3.5 scanning), so the halo saturates and widens when a card
   * crosses, as in the pen.
   */
  drawBeam(beam) {
    const x = beam.x;
    const lw = LIGHT_BAR_WIDTH;
    const g = beam.glow;
    // 0 when idle, 1 when fully scanning
    const t = clamp((g - IDLE.glow) / (SCANNING.glow - IDLE.glow), 0, 1);
    const a = v => clamp(v, 0, 1).toFixed(3);

    // White core
    this.fillBar(x, lw / 2, 15, [
      [0, 'rgba(255, 255, 255, 0)'],
      [0.3, `rgba(255, 255, 255, ${a(0.9 * g)})`],
      [0.5, `rgba(255, 255, 255, ${a(g)})`],
      [0.7, `rgba(255, 255, 255, ${a(0.9 * g)})`],
      [1, 'rgba(255, 255, 255, 0)'],
    ], 1);

    // Warm inner glow
    this.fillBar(x, lw * 2, 25, [
      [0, 'rgba(250, 110, 2, 0)'],
      [0.5, `rgba(255, 200, 140, ${a(0.8 * g)})`],
      [1, 'rgba(250, 110, 2, 0)'],
    ], 0.8 + 0.2 * t);

    // Orange mid glow
    this.fillBar(x, lw * 4, 35, [
      [0, 'rgba(250, 110, 2, 0)'],
      [0.5, `rgba(250, 110, 2, ${a(0.4 * g)})`],
      [1, 'rgba(250, 110, 2, 0)'],
    ], 0.6 + 0.2 * t);

    // Wide halo: only while scanning, faded in instead of popping
    if (t > 0.01) {
      this.fillBar(x, lw * 8, 45, [
        [0, 'rgba(236, 71, 0, 0)'],
        [0.5, 'rgba(236, 71, 0, 0.2)'],
        [1, 'rgba(236, 71, 0, 0)'],
      ], 0.6 * t);
    }
  }

  /**
   * Draw both beams, then apply the vertical fade mask once. Masking per beam
   * would fade the first beam twice and make the two beams look different.
   */
  drawBeams() {
    const ctx = this.ctx;
    const top = this.beamTopY;
    const height = this.beamBottomY - top;
    if (height <= 0) return;

    ctx.globalCompositeOperation = 'lighter';
    this.drawBeam(this.beams.left);
    this.drawBeam(this.beams.right);

    const fz = Math.min(this.beams.left.fadeZone, this.beams.right.fadeZone);
    const edge = clamp(fz / height, 0, 0.45);
    const mask = ctx.createLinearGradient(0, top, 0, top + height);
    mask.addColorStop(0, 'rgba(255, 255, 255, 0)');
    mask.addColorStop(edge, 'rgba(255, 255, 255, 1)');
    mask.addColorStop(1 - edge, 'rgba(255, 255, 255, 1)');
    mask.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.globalCompositeOperation = 'destination-in';
    ctx.globalAlpha = 1;
    ctx.fillStyle = mask;
    ctx.fillRect(0, 0, this.width, this.height);
  }

  /**
   * Ease every beam value toward its idle or scanning target.
   * @param {number} step - frame step normalised to 60fps
   */
  easeBeams(step) {
    const k = 1 - Math.pow(1 - TRANSITION_SPEED, step);
    Object.values(this.beams).forEach(beam => {
      const target = beam.scanning ? SCANNING : IDLE;
      beam.intensity += (target.intensity - beam.intensity) * k;
      beam.glow += (target.glow - beam.glow) * k;
      beam.fadeZone += (target.fadeZone - beam.fadeZone) * k;
      const maxTarget = beam.scanning ? PARTICLES_SCANNING : PARTICLES_IDLE;
      beam.maxParticles += (maxTarget - beam.maxParticles) * k;
    });
  }

  // ── Card Clipping ───────────────────────────────────────────────────────────

  /**
   * Clip each card against both beams and detect which beams are scanning.
   * Normal card shows between the beams; each ASCII layer shows outside its beam.
   */
  updateCardClipping() {
    const sectionLeft = this.section.getBoundingClientRect().left;
    const half = SCAN_WIDTH / 2;
    const lx = sectionLeft + this.beams.left.x;
    const rx = sectionLeft + this.beams.right.x;
    const lLeft = lx - half;
    const lRight = lx + half;
    const rLeft = rx - half;
    const rRight = rx + half;
    let leftScanning = false;
    let rightScanning = false;

    this.wrappers.forEach(wrapper => {
      const rect = wrapper.getBoundingClientRect();
      const cw = rect.width;
      if (cw <= 0) return;
      const cardLeft = rect.left;
      const cardRight = rect.right;
      const pct = px => clamp((px / cw) * 100, 0, 100);

      const normal = wrapper.children[0];
      const asciiLeft = wrapper.children[1];
      const asciiRight = wrapper.children[2];

      normal.style.setProperty('--clip-normal-left', `${pct(lRight - cardLeft)}%`);
      normal.style.setProperty('--clip-normal-right', `${pct(cardRight - rLeft)}%`);
      // Left ASCII spans from card left to the left beam
      asciiLeft.style.setProperty('--ascii-clip-right', `${100 - pct(lLeft - cardLeft)}%`);
      // Right ASCII spans from the right beam to card right
      asciiRight.style.setProperty('--ascii-clip-left', `${pct(rRight - cardLeft)}%`);

      const inLeft = cardLeft < lRight && cardRight > lLeft;
      const inRight = cardLeft < rRight && cardRight > rLeft;
      leftScanning = leftScanning || inLeft;
      rightScanning = rightScanning || inRight;

      this.handleScanFlash(wrapper, 'left', inLeft, cardLeft, cardRight, lx);
      this.handleScanFlash(wrapper, 'right', inRight, cardLeft, cardRight, rx);
    });

    this.beams.left.scanning = leftScanning;
    this.beams.right.scanning = rightScanning;
  }

  /**
   * Sweep a light flash across a card the moment it enters a beam.
   * The entry-window check prevents a flash when the loop wraps a card that
   * is already mid-beam.
   */
  handleScanFlash(wrapper, side, inBeam, cardLeft, cardRight, beamX) {
    const key = side === 'left' ? 'scannedLeft' : 'scannedRight';
    if (!inBeam) {
      delete wrapper.dataset[key];
      return;
    }
    if (wrapper.dataset[key]) return;
    wrapper.dataset[key] = 'true';

    const depth = Math.min(beamX - cardLeft, cardRight - beamX);
    if (depth > FLASH_ENTRY_WINDOW) return;

    const flash = document.createElement('div');
    flash.className = 'scan-effect';
    wrapper.appendChild(flash);
    flash.addEventListener('animationend', () => flash.remove(), { once: true });
  }

  // ── Carousel Motion ─────────────────────────────────────────────────────────

  setupEvents() {
    this.strip.addEventListener('mousedown', e => this.startDrag(e));
    document.addEventListener('mousemove', this.onDragHandler);
    document.addEventListener('mouseup', this.endDragHandler);

    this.strip.addEventListener('touchstart', e => this.startDrag(e.touches[0]), {
      passive: true,
    });
    document.addEventListener('touchmove', this.onTouchDragHandler, { passive: true });
    document.addEventListener('touchend', this.endDragHandler);

    this.strip.addEventListener('wheel', e => this.onWheel(e), { passive: false });
    this.strip.addEventListener('dragstart', e => e.preventDefault());
  }

  setupObservers() {
    if ('ResizeObserver' in window) {
      this.resizeObserver = new ResizeObserver(() => this.measure());
      this.resizeObserver.observe(this.section);
    } else {
      this.resizeHandler = () => this.measure();
      window.addEventListener('resize', this.resizeHandler);
    }

    // Stop all work while the section is off screen
    if ('IntersectionObserver' in window) {
      this.visibilityObserver = new IntersectionObserver(entries => {
        this.isVisible = entries[0].isIntersecting;
        if (this.isVisible) this.start();
        else this.stop();
      });
      this.visibilityObserver.observe(this.section);
    }
  }

  startDrag(e) {
    if (!e) return;
    this.isDragging = true;
    this.lastMouseX = e.clientX;
    this.mouseVelocity = 0;
    this.strip.classList.add('dragging');
    document.body.style.userSelect = 'none';
  }

  onDrag(e) {
    if (!this.isDragging || !e) return;
    const deltaX = e.clientX - this.lastMouseX;
    this.position += deltaX;
    this.mouseVelocity = deltaX * 60;
    this.lastMouseX = e.clientX;
    this.updatePosition();
  }

  endDrag() {
    if (!this.isDragging) return;
    this.isDragging = false;
    this.strip.classList.remove('dragging');

    if (Math.abs(this.mouseVelocity) > MIN_VELOCITY) {
      this.velocity = Math.abs(this.mouseVelocity);
      this.direction = this.mouseVelocity > 0 ? 1 : -1;
    } else {
      this.velocity = BASE_VELOCITY;
    }
    document.body.style.userSelect = '';
  }

  /**
   * Only horizontal wheel/trackpad gestures move the strip, so vertical page
   * scrolling over the cards keeps working.
   */
  onWheel(e) {
    if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
    e.preventDefault();
    this.position -= e.deltaX;
    this.updatePosition();
  }

  /** Keep position inside one loop period so the strip never runs out of cards */
  updatePosition() {
    const period = this.loopPeriod;
    if (period > 0) {
      while (this.position > 0) this.position -= period;
      while (this.position <= -period) this.position += period;
    }
    this.strip.style.transform = `translate3d(${this.position}px, 0, 0)`;
  }

  // ── Render Loop ─────────────────────────────────────────────────────────────

  render(timestamp) {
    const dt = this.lastTime ? Math.min((timestamp - this.lastTime) / 1000, 0.1) : 1 / 60;
    this.lastTime = timestamp;
    const step = dt * 60;

    if (this.isAnimating && !this.isDragging) {
      if (this.velocity > MIN_VELOCITY) this.velocity *= Math.pow(FRICTION, step);
      this.velocity = Math.max(MIN_VELOCITY, this.velocity);
      this.position += this.velocity * this.direction * dt;
      this.updatePosition();
    }

    this.updateCardClipping();
    this.easeBeams(step);
    this.renderAmbient(dt, step);

    const ctx = this.ctx;
    ctx.globalCompositeOperation = 'source-over';
    ctx.clearRect(0, 0, this.width, this.height);

    this.drawBeams();

    ctx.globalCompositeOperation = 'lighter';
    this.updateAndDrawParticles(step);
    this.spawnParticles('left');
    this.spawnParticles('right');
  }

  start() {
    if (this.rafId) return;
    this.lastTime = 0;
    const loop = ts => {
      this.render(ts);
      this.rafId = requestAnimationFrame(loop);
    };
    this.rafId = requestAnimationFrame(loop);
  }

  stop() {
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.rafId = null;
  }

  destroy() {
    this.destroyed = true;
    this.stop();
    if (this.threeAmbient) this.threeAmbient.destroy();
    if (this.intervalId) clearInterval(this.intervalId);

    document.removeEventListener('mousemove', this.onDragHandler);
    document.removeEventListener('mouseup', this.endDragHandler);
    document.removeEventListener('touchmove', this.onTouchDragHandler);
    document.removeEventListener('touchend', this.endDragHandler);
    if (this.resizeHandler) window.removeEventListener('resize', this.resizeHandler);
    if (this.resizeObserver) this.resizeObserver.disconnect();
    if (this.visibilityObserver) this.visibilityObserver.disconnect();

    document.body.style.userSelect = '';
    if (this.canvas) this.canvas.remove();
    if (this.ambientCanvas) this.ambientCanvas.remove();
    if (this.container) this.container.remove();
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Extract card data from the existing .services-grid articles.
 * @param {HTMLElement} section
 * @returns {{ title: string, body: string, iconClass: string }[]}
 */
function extractCardData(section) {
  const cards = section.querySelectorAll('.services-grid article.service-card');
  const data = [];
  cards.forEach(card => {
    const h2 = card.querySelector('h2');
    const iconSpan = h2?.querySelector('.service-card-icon');
    const iconClass = iconSpan
      ? Array.from(iconSpan.classList).find(cls => cls.startsWith('service-card-icon--')) || ''
      : '';
    const title = h2
      ? Array.from(h2.childNodes)
        .filter(node => node.nodeType === Node.TEXT_NODE)
        .map(node => node.textContent)
        .join('')
        .trim()
      : '';

    data.push({
      title,
      body: card.querySelector('p')?.textContent.trim() || '',
      iconClass,
    });
  });
  return data.length ? data : [{ title: 'Service', body: '', iconClass: '' }];
}

// ─── Export ───────────────────────────────────────────────────────────────────

let carouselInstance = null;

/**
 * Initialize the service scanner carousel effect.
 * Safe to call multiple times — destroys any previous instance first.
 * Only activates on pages that contain a .services section.
 */
export function initServiceScanner() {
  destroyServiceScanner();

  const section = document.querySelector('.services');
  if (!section) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  carouselInstance = new ServiceCarousel(section, extractCardData(section));
}

/**
 * Destroy the active service scanner instance and cancel its RAF loop.
 * Call when navigating away from an index page via SPA transition.
 */
export function destroyServiceScanner() {
  if (carouselInstance) {
    carouselInstance.destroy();
    carouselInstance = null;
  }
}
