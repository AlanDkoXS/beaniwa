const range = (min, max) => min + (max - min) * Math.random();

const weightedRange = (
  from,
  to,
  decimalPlaces = 0,
  weighted = null,
  strength = 0,
) => {
  if (from === to) return from;
  const precision = 10 ** decimalPlaces;
  const rand = (a, b) =>
    Math.round((Math.random() * (b - a) + a) * precision) / precision;
  return weighted && Math.random() <= strength
    ? rand(weighted[0], weighted[1])
    : rand(from, to);
};

const COLORS = {
  dark: "#c45200",
  base: "#fa6e02",
  bright: "#ffab5c",
  highlight: "#ffd4a0",
  white: "#ffffff",
  gray: "#888888",
};

class Particle {
  constructor(settings, canvasWidth, canvasHeight) {
    this.settings = settings;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.reset();
  }

  reset() {
    const { fromX, toX, areaHeight, ballwidth, alphamax, color, fill } =
      this.settings;
    const h = this.canvasHeight;
    const w = this.canvasWidth;
    const effectiveToX = toX || w;

    this.x = weightedRange(
      fromX,
      effectiveToX,
      1,
      [
        fromX + (effectiveToX - fromX) / 4,
        fromX + ((effectiveToX - fromX) * 3) / 4,
      ],
      0.6,
    );
    this.y = weightedRange(
      0,
      h,
      1,
      [(h * (2 - areaHeight / 2)) / 4, (h * (2 + areaHeight / 2)) / 4],
      0.8,
    );

    this.initX = this.x;
    this.initY = this.y;
    this.radius = ballwidth;
    this.scale = range(0.3, 1);
    this.targetScale = range(0.3, 1);
    this.alpha = range(0, 0.1);
    this.targetAlpha = range(0.1, alphamax);
    this.alphaMax = alphamax;
    this.speed = range(2, 10);
    this.distance = ballwidth * 2;
    this.color = color;
    this.fill = fill;
    this.progress = 0;
    this.fadingOut = false;
    this.fadeProgress = 0;
    this.startX = this.x;
    this.startY = this.y;
    this.startScale = this.scale;
    this.startAlpha = this.alpha;

    this._newTarget();
  }

  _newTarget() {
    this.startX = this.x;
    this.startY = this.y;
    this.startScale = this.scale;
    this.startAlpha = this.alpha;
    this.targetX = range(
      this.initX - this.distance,
      this.initX + this.distance,
    );
    this.targetY = range(
      this.initY - this.distance,
      this.initY + this.distance,
    );
    this.targetScale = range(0.3, 1);
    this.targetAlpha = range(0.1, this.alphaMax);
    this.speed = range(2, 10);
    this.progress = 0;
    this.fadingOut = false;
    this.fadeProgress = 0;
  }

  _ease(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
  }

  update(delta) {
    const step = delta / (this.speed * 1000);
    this.progress = Math.min(this.progress + step, 1);
    const e = this._ease(this.progress);

    this.x = this.startX + (this.targetX - this.startX) * e;
    this.y = this.startY + (this.targetY - this.startY) * e;
    this.scale = this.startScale + (this.targetScale - this.startScale) * e;

    if (!this.fadingOut) {
      this.fadeProgress = Math.min(this.fadeProgress + step * 2, 1);
      this.alpha =
        this.startAlpha +
        (this.targetAlpha - this.startAlpha) * this._ease(this.fadeProgress);
      if (this.fadeProgress >= 1) this.fadingOut = true;
    } else {
      this.alpha = Math.max(0, this.alpha - step * this.targetAlpha * 2);
    }

    if (this.progress >= 1) this._newTarget();
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, this.alpha);
    ctx.globalCompositeOperation = "lighter";
    ctx.translate(this.x, this.y);
    ctx.scale(this.scale, this.scale);
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2);

    if (this.fill) {
      ctx.fillStyle = this.color;
      ctx.fill();
    } else {
      ctx.strokeStyle = this.color;
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    ctx.restore();
  }

  resize(canvasWidth, canvasHeight) {
    const { fromX, toX, areaHeight } = this.settings;
    const effectiveToX = toX || canvasWidth;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.initX = weightedRange(
      fromX,
      effectiveToX,
      1,
      [
        fromX + (effectiveToX - fromX) / 4,
        fromX + ((effectiveToX - fromX) * 3) / 4,
      ],
      0.6,
    );
    this.initY = weightedRange(
      0,
      canvasHeight,
      1,
      [
        (canvasHeight * (2 - areaHeight / 2)) / 4,
        (canvasHeight * (2 + areaHeight / 2)) / 4,
      ],
      0.8,
    );
  }
}

class AmbientLight {
  constructor(config, canvasWidth, canvasHeight) {
    this.config = config;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.scaleX = 1;
    this.scaleY = 1;
    this.x = canvasWidth / 2 + config.offsetX;
    this.y = canvasHeight / 2 + config.offsetY;
    this.time = Math.random() * Math.PI * 2;
  }

  update(delta) {
    this.time += delta * 0.0008;
    const s = Math.sin(this.time);
    const c = Math.cos(this.time * 0.7);
    this.scaleX = 1.5 + s * 0.5;
    this.scaleY = 0.8 + c * 0.4;
    this.x = this.canvasWidth / 2 + this.config.offsetX + s * 50;
    this.y = this.canvasHeight / 2 + this.config.offsetY + c * 30;
  }

  draw(ctx) {
    ctx.save();
    ctx.globalCompositeOperation = "screen";
    ctx.globalAlpha = this.config.alpha;
    ctx.translate(this.x, this.y);
    ctx.scale(this.scaleX, this.scaleY);

    const radius =
      Math.max(this.config.ellipseWidth, this.config.ellipseHeight) / 2;
    const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, radius);
    grad.addColorStop(0, this.config.color);
    grad.addColorStop(1, "transparent");

    ctx.beginPath();
    ctx.ellipse(
      0,
      0,
      this.config.ellipseWidth / 2,
      this.config.ellipseHeight / 2,
      0,
      0,
      Math.PI * 2,
    );
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.restore();
  }

  resize(canvasWidth, canvasHeight) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
  }
}

class ParticleEngine {
  #canvas;
  #ctx;
  #particles = [];
  #lights = [];
  #lastTime = null;
  #rafId = null;

  #particleSettings = [
    {
      id: "small",
      num: 300,
      fromX: 0,
      toX: 0,
      ballwidth: 3,
      alphamax: 0.5,
      areaHeight: 0.5,
      color: COLORS.highlight,
      fill: false,
    },
    {
      id: "medium",
      num: 100,
      fromX: 0,
      toX: 0,
      ballwidth: 8,
      alphamax: 0.5,
      areaHeight: 1,
      color: COLORS.bright,
      fill: true,
    },
  ];

  #ambientLightSettings = [
    {
      ellipseWidth: 100,
      ellipseHeight: 80,
      alpha: 0.2,
      offsetX: 80,
      offsetY: -50,
      color: COLORS.bright,
    },
  ];

  #extraParticleSettings = [
    {
      id: "white",
      num: 15,
      fromX: 0,
      toX: 0,
      ballwidth: 4,
      alphamax: 0.5,
      areaHeight: 1,
      color: COLORS.white,
      fill: true,
    },
    {
      id: "gray",
      num: 15,
      fromX: 0,
      toX: 0,
      ballwidth: 5,
      alphamax: 0.5,
      areaHeight: 1,
      color: COLORS.gray,
      fill: true,
    },
  ];

  constructor(canvasId) {
    this.#canvas = document.getElementById(canvasId);
    this.#ctx = this.#canvas.getContext("2d");

    requestAnimationFrame(() => {
      this.#resize();
      this.#init();
      window.addEventListener("resize", () => this.#resize());
      this.#loop();
    });
  }

  #resize() {
    this.#canvas.width = this.#canvas.offsetWidth || window.innerWidth;
    this.#canvas.height = this.#canvas.offsetHeight || window.innerHeight;

    const w = this.#canvas.width;
    const h = this.#canvas.height;

    this.#particleSettings.forEach(s => {
      s.fromX = 0;
      s.toX = w;
    });
    this.#particles.forEach(p => p.resize(w, h));
    this.#lights.forEach(l => l.resize(w, h));
  }

  #init() {
    const w = this.#canvas.width;
    const h = this.#canvas.height;

    this.#ambientLightSettings.forEach(cfg => {
      this.#lights.push(new AmbientLight(cfg, w, h));
    });

    this.#particleSettings.forEach(settings => {
      settings.toX = w;
      for (let i = 0; i < settings.num; i++) {
        this.#particles.push(new Particle(settings, w, h));
      }
    });

    this.#extraParticleSettings.forEach(settings => {
      settings.toX = w;
      for (let i = 0; i < settings.num; i++) {
        this.#particles.push(new Particle(settings, w, h));
      }
    });
  }

  #loop(timestamp = 0) {
    const delta = this.#lastTime === null ? 16 : timestamp - this.#lastTime;
    this.#lastTime = timestamp;

    const { width: w, height: h } = this.#canvas;
    this.#ctx.clearRect(0, 0, w, h);

    this.#lights.forEach(l => {
      l.update(delta);
      l.draw(this.#ctx);
    });
    this.#particles.forEach(p => {
      p.update(delta);
      p.draw(this.#ctx);
    });

    this.#rafId = requestAnimationFrame(ts => this.#loop(ts));
  }

  destroy() {
    cancelAnimationFrame(this.#rafId);
    window.removeEventListener("resize", this.#rafId);
  }
}

export function initParticleEngine() {
  return new ParticleEngine("projector");
}
