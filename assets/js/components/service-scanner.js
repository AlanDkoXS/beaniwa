/**
 * Service Card Scanner Effect
 *
 * Infinite horizontal carousel of service cards with a dual-beam scanner.
 * Two beams are fixed at the center of the viewport:
 *   - Left beam  (~45% of section width)
 *   - Right beam (~55% of section width)
 *
 * Clipping rule:
 *   - LEFT  of the left beam  → ASCII visible
 *   - CENTER (between beams)  → normal card visible
 *   - RIGHT of the right beam → ASCII visible
 *
 * The carousel scrolls automatically (like CardStreamController from
 * .examples/card beam/main.js) and supports drag + wheel interaction.
 */

// ─── ASCII Code Generator ────────────────────────────────────────────────────

/**
 * Returns a block of themed code to fill an ASCII card overlay.
 * @param {number} cols - approximate character columns
 * @param {number} rows - approximate character rows
 * @returns {string}
 */
function generateServiceCode(cols = 60, rows = 20) {
  const library = [
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

  let flow = library.join(' ');
  const needed = cols * rows + cols;
  while (flow.length < needed) {
    flow += ' ' + library.join(' ');
  }

  let out = '';
  let offset = 0;
  for (let row = 0; row < rows; row++) {
    let line = flow.slice(offset, offset + cols);
    if (line.length < cols) line = line + ' '.repeat(cols - line.length);
    out += line + (row < rows - 1 ? '\n' : '');
    offset += cols;
  }
  return out;
}

// ─── ServiceCarousel ─────────────────────────────────────────────────────────

/** Card dimensions (px) */
const CARD_WIDTH = 300;
const CARD_HEIGHT = 200;
const CARD_GAP = 40;
/** Number of card copies to fill the strip */
const CARD_COPIES = 20;

class ServiceCarousel {
  /**
   * @param {HTMLElement} section - the .services element
   * @param {string[]} cardData - array of { title, body } objects from the real cards
   */
  constructor(section, cardData) {
    this.section = section;
    this.cardData = cardData;

    // Carousel motion
    this.position = 0;
    this.velocity = 80; // px/s
    this.direction = -1; // -1 = moving left
    this.isAnimating = true;
    this.isDragging = false;
    this.lastMouseX = 0;
    this.mouseVelocity = 0;
    this.friction = 0.95;
    this.minVelocity = 30;
    this.lastTime = 0;

    // Dimensions
    this.stripWidth = 0;
    this.containerWidth = 0;

    // Particle scanner
    this.canvas = null;
    this.ctx = null;
    this.gradientCache = null;
    this.particles = {};
    this.particleCount = 0;
    this.maxParticles = 600;

    // Scanner beams (two fixed positions in section space)
    this.beamLeftX = 0;    // set in resizeCanvas
    this.beamRightX = 0;
    this.beamTopY = 0;     // vertical extent: strip container top - 1rem
    this.beamBottomY = 0;  // vertical extent: strip container bottom + 1rem
    this.lightBarWidth = 3;
    this.fadeZone = 16;    // px fade at beam top/bottom edges

    // Event handlers for cleanup
    this.onDragHandler = null;
    this.endDragHandler = null;
    this.onTouchDragHandler = null;
    this.endTouchDragHandler = null;
    this.resizeHandler = null;

    this.rafId = null;
    this.intervalId = null;

    this.init();
  }

  init() {
    this.buildStrip();
    this.createCanvas();
    this.createGradientCache();
    this.initParticles();

    // Set up event handlers for cleanup
    this.onDragHandler = e => this.onDrag(e);
    this.endDragHandler = () => this.endDrag();
    this.onTouchDragHandler = e => this.onDrag(e.touches[0]);
    this.endTouchDragHandler = () => this.endDrag();

    this.setupEvents();
    this.animate();

    // Periodically refresh ASCII for a live-terminal feel
    this.intervalId = setInterval(() => this.updateAsciiContent(), 220);
  }

  // ── Strip Construction ──────────────────────────────────────────────────────

  buildStrip() {
    // Remove any previous carousel containers
    const old = this.section.querySelector('.scanner-strip-container');
    if (old) old.remove();

    // Outer container: clips overflow
    const container = document.createElement('div');
    container.className = 'scanner-strip-container';
    container.setAttribute('aria-hidden', 'true');

    // Inner strip: the sliding row of cards
    const strip = document.createElement('div');
    strip.className = 'scanner-strip';
    strip.setAttribute('role', 'list');

    // Fill strip with CARD_COPIES copies of each card (cycling through cardData)
    for (let i = 0; i < CARD_COPIES; i++) {
      const data = this.cardData[i % this.cardData.length];
      const wrapper = this.createCardWrapper(data, i);
      strip.appendChild(wrapper);
    }

    container.appendChild(strip);

    // Insert before the existing services-grid (which we hide via CSS)
    const grid = this.section.querySelector('.services-grid');
    if (grid) {
      this.section.insertBefore(container, grid);
    } else {
      // Fallback: append before CTA button
      const btn = this.section.querySelector('.btn');
      if (btn) {
        this.section.insertBefore(container, btn);
      } else {
        this.section.appendChild(container);
      }
    }

    this.strip = strip;
    this.container = container;

    this.calculateDimensions();
  }

  createCardWrapper(data, index) {
    const wrapper = document.createElement('div');
    wrapper.className = 'scanner-card-wrapper';
    wrapper.setAttribute('role', 'listitem');

    // Normal card layer
    const normal = document.createElement('div');
    normal.className = 'scanner-card-normal';

    const h2 = document.createElement('h2');
    h2.textContent = data.title;
    const p = document.createElement('p');
    p.textContent = data.body;
    normal.appendChild(h2);
    normal.appendChild(p);

    // ASCII layer
    const ascii = document.createElement('div');
    ascii.className = 'scanner-card-ascii';
    ascii.setAttribute('aria-hidden', 'true');

    const asciiContent = document.createElement('div');
    asciiContent.className = 'ascii-content';

    // Dimensions for code generation
    const fontSize = 10;
    const lineHeight = 12;
    const charWidth = 6;
    const cols = Math.floor(CARD_WIDTH / charWidth);
    const rows = Math.floor(CARD_HEIGHT / lineHeight);
    asciiContent.style.fontSize = fontSize + 'px';
    asciiContent.style.lineHeight = lineHeight + 'px';
    asciiContent.textContent = generateServiceCode(cols, rows);

    ascii.appendChild(asciiContent);
    wrapper.appendChild(normal);
    wrapper.appendChild(ascii);

    return wrapper;
  }

  calculateDimensions() {
    this.containerWidth = this.container.offsetWidth;
    const cardCount = this.strip.children.length;
    this.stripWidth = (CARD_WIDTH + CARD_GAP) * cardCount;
  }

  // ── ASCII Refresh ──────────────────────────────────────────────────────────

  updateAsciiContent() {
    const charWidth = 6;
    const lineHeight = 12;
    const cols = Math.floor(CARD_WIDTH / charWidth);
    const rows = Math.floor(CARD_HEIGHT / lineHeight);

    this.strip.querySelectorAll('.ascii-content').forEach(el => {
      if (Math.random() < 0.15) {
        el.textContent = generateServiceCode(cols, rows);
      }
    });
  }

  // ── Canvas ──────────────────────────────────────────────────────────────────

  createCanvas() {
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'serviceScannerCanvas';
    this.canvas.setAttribute('aria-hidden', 'true');
    // Force position:absolute inline so the canvas never participates in block
    // layout — even before service-scanner.css has been applied (race condition
    // on back/forward navigation via syncHead).
    this.canvas.style.position = 'absolute';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.pointerEvents = 'none';
    this.ctx = this.canvas.getContext('2d');
    this.section.appendChild(this.canvas);
    this.resizeCanvas();

    this.resizeHandler = () => {
      this.resizeCanvas();
      this.calculateDimensions();
    };
    window.addEventListener('resize', this.resizeHandler);
  }

  resizeCanvas() {
    const w = this.section.offsetWidth;
    const h = this.section.offsetHeight;
    this.canvas.width = w;
    this.canvas.height = h;
    this.canvas.style.width = w + 'px';
    this.canvas.style.height = h + 'px';

    if (!this.container) return;

    const sectionRect = this.section.getBoundingClientRect();
    const cRect = this.container.getBoundingClientRect();
    const containerLeft = cRect.left - sectionRect.left;
    const containerW = cRect.width;

    // Beams at the CSS mask fade zone boundaries (6% from each edge of container).
    // This places them exactly where cards first appear / disappear visually.
    const fadeFrac = 0.06;
    this.beamLeftX  = containerLeft + containerW * fadeFrac;
    this.beamRightX = containerLeft + containerW * (1 - fadeFrac);

    // Beam height: strip container bounds ± 1rem
    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    this.beamTopY    = (cRect.top    - sectionRect.top) - rem;
    this.beamBottomY = (cRect.bottom - sectionRect.top) + rem;
  }

  /**
   * Pre-render a small radial gradient for each particle (orange brand color).
   */
  createGradientCache() {
    const gc = document.createElement('canvas');
    gc.width = 16;
    gc.height = 16;
    const ctx = gc.getContext('2d');
    const half = 8;
    const g = ctx.createRadialGradient(half, half, 0, half, half, half);
    g.addColorStop(0, 'rgba(255, 255, 255, 1)');
    g.addColorStop(0.25, 'rgba(250, 110, 2, 0.9)');
    g.addColorStop(0.6, 'rgba(250, 110, 2, 0.35)');
    g.addColorStop(1, 'transparent');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(half, half, half, 0, Math.PI * 2);
    ctx.fill();
    this.gradientCache = gc;
  }

  // ── Particles ───────────────────────────────────────────────────────────────

  /**
   * Creates a particle originating from one of the two beams.
   * Particles from the left beam drift left; from the right beam drift right.
   * @param {'left'|'right'} beam
   */
  createParticle(beam = 'left') {
    const topY    = this.beamTopY    || 0;
    const bottomY = this.beamBottomY || this.canvas.height;
    const spanY   = bottomY - topY;
    const isLeft  = beam === 'left';
    const originX = isLeft ? this.beamLeftX : this.beamRightX;
    const vxSign  = isLeft ? -1 : 1;

    return {
      beam,
      x: originX + (Math.random() - 0.5) * this.lightBarWidth,
      y: topY + Math.random() * spanY,
      vx: (Math.random() * 0.8 + 0.2) * vxSign,
      vy: (Math.random() - 0.5) * 0.3,
      radius: Math.random() * 0.9 + 0.3,
      alpha: Math.random() * 0.4 + 0.6,
      originalAlpha: 0,
      life: 1.0,
      decay: Math.random() * 0.012 + 0.004,
      time: 0,
      twinkleSpeed: Math.random() * 0.07 + 0.02,
      twinkleAmount: Math.random() * 0.2 + 0.1,
    };
  }

  initParticles() {
    const half = Math.floor(this.maxParticles / 2);
    for (let i = 0; i < half; i++) {
      const p = this.createParticle('left');
      p.originalAlpha = p.alpha;
      this.particleCount++;
      this.particles[this.particleCount] = p;
    }
    for (let i = 0; i < half; i++) {
      const p = this.createParticle('right');
      p.originalAlpha = p.alpha;
      this.particleCount++;
      this.particles[this.particleCount] = p;
    }
  }

  updateParticle(p) {
    p.x += p.vx;
    p.y += p.vy;
    p.time++;
    p.alpha =
      p.originalAlpha * p.life +
      Math.sin(p.time * p.twinkleSpeed) * p.twinkleAmount;
    p.life -= p.decay;

    const w = this.canvas.width;
    const h = this.canvas.height;
    const dead = p.life <= 0 || p.x < -10 || p.x > w + 10;
    if (dead) this.resetParticle(p);
  }

  resetParticle(p) {
    const topY    = this.beamTopY    || 0;
    const bottomY = this.beamBottomY || this.canvas.height;
    const spanY   = bottomY - topY;
    const isLeft  = p.beam === 'left';
    const originX = isLeft ? this.beamLeftX : this.beamRightX;
    const vxSign  = isLeft ? -1 : 1;

    p.x = originX + (Math.random() - 0.5) * this.lightBarWidth;
    p.y = topY + Math.random() * spanY;
    p.vx = (Math.random() * 0.8 + 0.2) * vxSign;
    p.vy = (Math.random() - 0.5) * 0.3;
    p.alpha = Math.random() * 0.4 + 0.6;
    p.originalAlpha = p.alpha;
    p.life = 1.0;
    p.time = 0;
  }

  drawParticle(p) {
    if (p.life <= 0) return;
    const topY    = this.beamTopY    || 0;
    const bottomY = this.beamBottomY || this.canvas.height;
    const fz = this.fadeZone;

    // Hard-clip particles outside the beam vertical range
    if (p.y < topY || p.y > bottomY) return;

    let fadeAlpha = 1;
    if (p.y < topY + fz) {
      fadeAlpha = (p.y - topY) / fz;
    } else if (p.y > bottomY - fz) {
      fadeAlpha = (bottomY - p.y) / fz;
    }
    fadeAlpha = Math.max(0, Math.min(1, fadeAlpha));

    this.ctx.globalAlpha = Math.max(0, Math.min(1, p.alpha)) * fadeAlpha;
    const r = p.radius;
    this.ctx.drawImage(this.gradientCache, p.x - r, p.y - r, r * 2, r * 2);
  }

  // ── Beam Drawing ────────────────────────────────────────────────────────────

  /**
   * Draw a single vertical beam at position x.
   */
  drawBeamAt(x) {
    const topY    = this.beamTopY    || 0;
    const bottomY = this.beamBottomY || this.canvas.height;
    const beamH   = bottomY - topY;
    const lw = this.lightBarWidth;
    const fz = this.fadeZone;

    // Vertical fade — from topY to bottomY only
    const vertGrad = this.ctx.createLinearGradient(0, topY, 0, bottomY);
    vertGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
    vertGrad.addColorStop(Math.min(fz / beamH, 0.35), 'rgba(255, 255, 255, 1)');
    vertGrad.addColorStop(Math.max(1 - fz / beamH, 0.65), 'rgba(255, 255, 255, 1)');
    vertGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

    this.ctx.globalCompositeOperation = 'lighter';

    // Core white line
    const core = this.ctx.createLinearGradient(x - lw / 2, 0, x + lw / 2, 0);
    core.addColorStop(0, 'rgba(255, 255, 255, 0)');
    core.addColorStop(0.3, 'rgba(255, 255, 255, 0.9)');
    core.addColorStop(0.5, 'rgba(255, 255, 255, 1)');
    core.addColorStop(0.7, 'rgba(255, 255, 255, 0.9)');
    core.addColorStop(1, 'rgba(255, 255, 255, 0)');
    this.ctx.globalAlpha = 1;
    this.ctx.fillStyle = core;
    this.ctx.beginPath();
    this.ctx.roundRect(x - lw / 2, topY, lw, beamH, 15);
    this.ctx.fill();

    // Orange inner glow
    const glow1 = this.ctx.createLinearGradient(x - lw * 3, 0, x + lw * 3, 0);
    glow1.addColorStop(0, 'rgba(250, 110, 2, 0)');
    glow1.addColorStop(0.5, 'rgba(255, 190, 80, 0.85)');
    glow1.addColorStop(1, 'rgba(250, 110, 2, 0)');
    this.ctx.globalAlpha = 0.9;
    this.ctx.fillStyle = glow1;
    this.ctx.beginPath();
    this.ctx.roundRect(x - lw * 3, topY, lw * 6, beamH, 25);
    this.ctx.fill();

    // Orange mid glow
    const glow2 = this.ctx.createLinearGradient(x - lw * 7, 0, x + lw * 7, 0);
    glow2.addColorStop(0, 'rgba(250, 110, 2, 0)');
    glow2.addColorStop(0.5, 'rgba(250, 110, 2, 0.45)');
    glow2.addColorStop(1, 'rgba(250, 110, 2, 0)');
    this.ctx.globalAlpha = 0.7;
    this.ctx.fillStyle = glow2;
    this.ctx.beginPath();
    this.ctx.roundRect(x - lw * 7, topY, lw * 14, beamH, 35);
    this.ctx.fill();

    // Orange outer glow
    const glow3 = this.ctx.createLinearGradient(x - lw * 14, 0, x + lw * 14, 0);
    glow3.addColorStop(0, 'rgba(236, 71, 0, 0)');
    glow3.addColorStop(0.5, 'rgba(236, 71, 0, 0.2)');
    glow3.addColorStop(1, 'rgba(236, 71, 0, 0)');
    this.ctx.globalAlpha = 0.5;
    this.ctx.fillStyle = glow3;
    this.ctx.beginPath();
    this.ctx.roundRect(x - lw * 14, topY, lw * 28, beamH, 45);
    this.ctx.fill();

    // Apply vertical fade mask — only within the beam's vertical band
    this.ctx.globalCompositeOperation = 'destination-in';
    this.ctx.globalAlpha = 1;
    this.ctx.fillStyle = vertGrad;
    this.ctx.fillRect(0, topY, this.canvas.width, beamH);
  }

  drawBeams() {
    // Draw left beam
    this.drawBeamAt(this.beamLeftX);

    // Reset composite before drawing right beam
    this.ctx.globalCompositeOperation = 'source-over';
    this.ctx.globalAlpha = 1;

    // Draw right beam
    this.drawBeamAt(this.beamRightX);
  }

  // ── Card Clipping ───────────────────────────────────────────────────────────

  /**
   * Dual-beam clipping:
   *   - Left of beamLeft  → ASCII visible (normal card hidden)
   *   - Center (between)  → normal card visible (ASCII hidden)
   *   - Right of beamRight → ASCII visible (normal card hidden)
   *
   * CSS variables used:
   *   --clip-normal-left   inset from left  (clips normal card from left)
   *   --clip-normal-right  inset from right (clips normal card from right)
   *   --clip-ascii-left    inset from left  (clips ascii card from left)
   *   --clip-ascii-right   inset from right (clips ascii card from right)
   *
   * Uses a read-then-write pattern to avoid layout thrashing:
   *   1. Batch all getBoundingClientRect() reads first.
   *   2. Then apply all CSS custom property writes.
   *
   * @param {DOMRect} sectionRect - pre-read section bounding rect (passed from render())
   */
  updateCardClipping(sectionRect) {
    const lx = sectionRect.left + this.beamLeftX;   // left beam screen X
    const rx = sectionRect.left + this.beamRightX;  // right beam screen X
    const lLeft = lx - this.lightBarWidth / 2;
    const lRight = lx + this.lightBarWidth / 2;
    const rLeft = rx - this.lightBarWidth / 2;
    const rRight = rx + this.lightBarWidth / 2;

    const wrappers = this.strip.querySelectorAll('.scanner-card-wrapper');

    // ── Phase 1: batch-read all rects (no writes yet) ─────────────────────
    const items = [];
    wrappers.forEach(wrapper => {
      const rect = wrapper.getBoundingClientRect();
      if (rect.width <= 0) return;
      items.push({
        wrapper,
        rect,
        normal: wrapper.querySelector('.scanner-card-normal'),
        asciiLeft: wrapper.querySelector('.scanner-card-ascii-left'),
        asciiRight: wrapper.querySelector('.scanner-card-ascii-right'),
      });
    });

    // ── Phase 2: compute values and write CSS properties (no reads) ────────
    items.forEach(({ wrapper, rect, normal, asciiLeft, asciiRight }) => {
      const cw = rect.width;
      const cardLeft = rect.left;
      const cardRight = rect.right;

      // Normal card: visible only between the two beams
      let normalClipL = lRight > cardLeft ? ((lRight - cardLeft) / cw) * 100 : 0;
      let normalClipR = rLeft < cardRight ? ((cardRight - rLeft) / cw) * 100 : 0;
      normalClipL = Math.max(0, Math.min(100, normalClipL));
      normalClipR = Math.max(0, Math.min(100, normalClipR));

      if (normal) {
        normal.style.setProperty('--clip-normal-left', `${normalClipL}%`);
        normal.style.setProperty('--clip-normal-right', `${normalClipR}%`);
      }

      if (asciiLeft && asciiRight) {
        // asciiLeft: clip from the right, showing only the area left of the left beam
        let asciiLClipR;
        if (lLeft > cardLeft && lLeft < cardRight) {
          asciiLClipR = ((cardRight - lLeft) / cw) * 100;
        } else if (lLeft <= cardLeft) {
          asciiLClipR = 0; // beam has passed whole card → fill entirely
        } else {
          asciiLClipR = 100; // beam hasn't reached yet → hidden
        }

        // asciiRight: clip from the left, showing only the area right of the right beam
        let asciiRClipL;
        if (rRight > cardLeft && rRight < cardRight) {
          asciiRClipL = ((rRight - cardLeft) / cw) * 100;
        } else if (rRight <= cardLeft) {
          asciiRClipL = 0; // beam is left of card → fill entirely
        } else {
          asciiRClipL = 100; // beam hasn't reached yet → hidden
        }

        asciiLClipR = Math.max(0, Math.min(100, asciiLClipR));
        asciiRClipL = Math.max(0, Math.min(100, asciiRClipL));

        asciiLeft.style.setProperty('--ascii-clip-right', `${asciiLClipR}%`);
        asciiRight.style.setProperty('--ascii-clip-left', `${asciiRClipL}%`);
      }
    });
  }

  // ── Carousel Motion ─────────────────────────────────────────────────────────

  setupEvents() {
    this.strip.addEventListener('mousedown', e => this.startDrag(e));
    document.addEventListener('mousemove', this.onDragHandler);
    document.addEventListener('mouseup', this.endDragHandler);

    this.strip.addEventListener('touchstart', e => this.startDrag(e.touches[0]), { passive: false });
    document.addEventListener('touchmove', this.onTouchDragHandler, { passive: false });
    document.addEventListener('touchend', this.endTouchDragHandler);

    this.strip.addEventListener('wheel', e => this.onWheel(e));
    this.strip.addEventListener('selectstart', e => e.preventDefault());
    this.strip.addEventListener('dragstart', e => e.preventDefault());
  }

  startDrag(e) {
    if (e.preventDefault) e.preventDefault();
    this.isDragging = true;
    this.isAnimating = false;
    this.lastMouseX = e.clientX;
    this.mouseVelocity = 0;

    const transform = window.getComputedStyle(this.strip).transform;
    if (transform !== 'none') {
      const matrix = new DOMMatrix(transform);
      this.position = matrix.m41;
    }

    this.strip.classList.add('dragging');
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'grabbing';
  }

  onDrag(e) {
    if (!this.isDragging) return;
    if (e.preventDefault) e.preventDefault();

    const deltaX = e.clientX - this.lastMouseX;
    this.position += deltaX;
    this.mouseVelocity = deltaX * 60;
    this.lastMouseX = e.clientX;

    this.strip.style.transform = `translateX(${this.position}px)`;
    this.updateCardClipping(this.section.getBoundingClientRect());
  }

  endDrag() {
    if (!this.isDragging) return;
    this.isDragging = false;
    this.strip.classList.remove('dragging');

    if (Math.abs(this.mouseVelocity) > this.minVelocity) {
      this.velocity = Math.abs(this.mouseVelocity);
      this.direction = this.mouseVelocity > 0 ? 1 : -1;
    } else {
      this.velocity = 80;
    }

    this.isAnimating = true;
    document.body.style.userSelect = '';
    document.body.style.cursor = '';
  }

  onWheel(e) {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 20 : -20;
    this.position += delta;
    this.updatePosition();
    this.updateCardClipping(this.section.getBoundingClientRect());
  }

  updatePosition() {
    // Infinite loop: wrap position when strip goes fully off one side
    if (this.position < -this.stripWidth) {
      this.position = this.containerWidth;
    } else if (this.position > this.containerWidth) {
      this.position = -this.stripWidth;
    }
    this.strip.style.transform = `translateX(${this.position}px)`;
  }

  // ── Render Loop ─────────────────────────────────────────────────────────────

  render(timestamp) {
    const deltaTime = this.lastTime ? (timestamp - this.lastTime) / 1000 : 0.016;
    this.lastTime = timestamp;

    // ── Read phase: snapshot geometry before any writes ───────────────────
    // Reading getBoundingClientRect here (before canvas writes) avoids
    // forced synchronous layout / reflow warnings.
    const sectionRect = this.section.getBoundingClientRect();

    // Advance carousel
    if (this.isAnimating && !this.isDragging) {
      if (this.velocity > this.minVelocity) {
        this.velocity *= this.friction;
      } else {
        this.velocity = Math.max(this.minVelocity, this.velocity);
      }
      this.position += this.velocity * this.direction * deltaTime;
      this.updatePosition();
    }

    const w = this.canvas.width;
    const h = this.canvas.height;

    this.ctx.globalCompositeOperation = 'source-over';
    this.ctx.clearRect(0, 0, w, h);

    this.drawBeams();

    // Clip particle rendering to beam vertical range so particles never appear
    // above or below the strip container.
    const clipTop    = Math.max(0, this.beamTopY    || 0);
    const clipBottom = Math.min(h, this.beamBottomY || h);
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.rect(0, clipTop, w, clipBottom - clipTop);
    this.ctx.clip();

    this.ctx.globalCompositeOperation = 'lighter';
    for (let i = 1; i <= this.particleCount; i++) {
      const p = this.particles[i];
      if (!p) continue;
      this.updateParticle(p);
      this.drawParticle(p);
    }

    this.ctx.restore();

    // Spawn new particles (split evenly between beams)
    if (this.particleCount < this.maxParticles && Math.random() < 0.8) {
      const beam = Math.random() < 0.5 ? 'left' : 'right';
      const p = this.createParticle(beam);
      p.originalAlpha = p.alpha;
      this.particleCount++;
      this.particles[this.particleCount] = p;
    }

    // Trim excess
    if (this.particleCount > this.maxParticles + 50) {
      const excess = Math.min(10, this.particleCount - this.maxParticles);
      for (let i = 0; i < excess; i++) delete this.particles[this.particleCount - i];
      this.particleCount -= excess;
    }

    this.updateCardClipping(sectionRect);
  }

  animate(timestamp = 0) {
    this.render(timestamp);
    this.rafId = requestAnimationFrame(ts => this.animate(ts));
  }

  destroy() {
    if (this.rafId) cancelAnimationFrame(this.rafId);
    if (this.intervalId) clearInterval(this.intervalId);

    // Remove document-level event listeners to prevent leaks across navigations
    if (this.onDragHandler) {
      document.removeEventListener('mousemove', this.onDragHandler);
      document.removeEventListener('touchmove', this.onTouchDragHandler);
    }
    if (this.endDragHandler) {
      document.removeEventListener('mouseup', this.endDragHandler);
      document.removeEventListener('touchend', this.endTouchDragHandler);
    }
    if (this.resizeHandler) {
      window.removeEventListener('resize', this.resizeHandler);
    }

    if (this.canvas) this.canvas.remove();
    const container = this.section.querySelector('.scanner-strip-container');
    if (container) container.remove();
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Extract card data from the existing .services-grid articles.
 * @param {HTMLElement} section
 * @returns {{ title: string, body: string }[]}
 */
function extractCardData(section) {
  const cards = section.querySelectorAll('.services-grid article.service-card');
  const data = [];
  cards.forEach(card => {
    data.push({
      title: card.querySelector('h2')?.textContent.trim() || '',
      body: card.querySelector('p')?.textContent.trim() || '',
    });
  });
  return data.length ? data : [{ title: 'Service', body: '' }];
}

/**
 * Build the scanner-card-ascii-left / scanner-card-ascii-right sub-elements
 * inside each scanner-card-wrapper after the strip is in the DOM.
 */
function buildAsciiSubLayers(strip) {
  const charWidth = 6;
  const lineHeight = 12;
  const cols = Math.floor(CARD_WIDTH / charWidth);
  const rows = Math.floor(CARD_HEIGHT / lineHeight);

  strip.querySelectorAll('.scanner-card-wrapper').forEach(wrapper => {
    // Replace the generic ascii div with two sided divs
    const oldAscii = wrapper.querySelector('.scanner-card-ascii');
    if (oldAscii) oldAscii.remove();

    const asciiLeft = document.createElement('div');
    asciiLeft.className = 'scanner-card-ascii scanner-card-ascii-left';
    asciiLeft.setAttribute('aria-hidden', 'true');
    const contentLeft = document.createElement('div');
    contentLeft.className = 'ascii-content ascii-content--left';
    contentLeft.style.fontSize = '10px';
    contentLeft.style.lineHeight = '12px';
    contentLeft.textContent = generateServiceCode(cols, rows);
    asciiLeft.appendChild(contentLeft);

    const asciiRight = document.createElement('div');
    asciiRight.className = 'scanner-card-ascii scanner-card-ascii-right';
    asciiRight.setAttribute('aria-hidden', 'true');
    const contentRight = document.createElement('div');
    contentRight.className = 'ascii-content ascii-content--right';
    contentRight.style.fontSize = '10px';
    contentRight.style.lineHeight = '12px';
    contentRight.textContent = generateServiceCode(cols, rows);
    asciiRight.appendChild(contentRight);

    wrapper.appendChild(asciiLeft);
    wrapper.appendChild(asciiRight);
  });
}

// ─── Export ───────────────────────────────────────────────────────────────────

let carouselInstance = null;

/**
 * Initialize the service scanner carousel effect.
 * Safe to call multiple times — destroys any previous instance first.
 * Only activates on pages that contain a .services section.
 */
export function initServiceScanner() {
  if (carouselInstance) {
    carouselInstance.destroy();
    carouselInstance = null;
  }

  const section = document.querySelector('.services');
  if (!section) return;

  const cardData = extractCardData(section);
  carouselInstance = new ServiceCarousel(section, cardData);
  buildAsciiSubLayers(carouselInstance.strip);
}
