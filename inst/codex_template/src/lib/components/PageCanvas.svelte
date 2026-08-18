<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { animationState } from '../animationState.svelte';

  let canvas = $state<HTMLCanvasElement>();
  let ctx: CanvasRenderingContext2D | null = null;
  let rafId: number;
  
  let width = 0;
  let height = 0;
  let mouseX = -1000;
  let mouseY = -1000;

  // -------------------------------------------------------------
  // SIMPLEX NOISE & FBM GENERATIVE MATH ENGINE (p5 / TouchDesigner style)
  // -------------------------------------------------------------
  const F2 = 0.5 * (Math.sqrt(3.0) - 1.0);
  const G2 = (3.0 - Math.sqrt(3.0)) / 6.0;
  const p = new Uint8Array(512);
  const perm = new Uint8Array(512);
  const grad2 = [
    [1, 1], [-1, 1], [1, -1], [-1, -1],
    [1, 0], [-1, 0], [0, 1], [0, -1]
  ];

  // Seed permutation table
  for (let i = 0; i < 256; i++) p[i] = i;
  for (let i = 255; i > 0; i--) {
    const j = Math.floor((i + 1) * Math.sin(i * 997.13 + 1.23) * 10000) & 255;
    const temp = p[i]; p[i] = p[j]; p[j] = temp;
  }
  for (let i = 0; i < 512; i++) perm[i] = p[i & 255];

  function simplex2(xin: number, yin: number): number {
    let n0 = 0, n1 = 0, n2 = 0;
    const s = (xin + yin) * F2;
    const i = Math.floor(xin + s);
    const j = Math.floor(yin + s);
    const t = (i + j) * G2;
    const X0 = i - t;
    const Y0 = j - t;
    const x0 = xin - X0;
    const y0 = yin - Y0;

    let i1 = 0, j1 = 0;
    if (x0 > y0) { i1 = 1; j1 = 0; } else { i1 = 0; j1 = 1; }

    const x1 = x0 - i1 + G2;
    const y1 = y0 - j1 + G2;
    const x2 = x0 - 1.0 + 2.0 * G2;
    const y2 = y0 - 1.0 + 2.0 * G2;

    const ii = i & 255;
    const jj = j & 255;
    const gi0 = perm[ii + perm[jj]] % 8;
    const gi1 = perm[ii + i1 + perm[jj + j1]] % 8;
    const gi2 = perm[ii + 1 + perm[jj + 1]] % 8;

    let t0 = 0.5 - x0 * x0 - y0 * y0;
    if (t0 >= 0) {
      t0 *= t0;
      n0 = t0 * t0 * (grad2[gi0][0] * x0 + grad2[gi0][1] * y0);
    }
    let t1 = 0.5 - x1 * x1 - y1 * y1;
    if (t1 >= 0) {
      t1 *= t1;
      n1 = t1 * t1 * (grad2[gi1][0] * x1 + grad2[gi1][1] * y1);
    }
    let t2 = 0.5 - x2 * x2 - y2 * y2;
    if (t2 >= 0) {
      t2 *= t2;
      n2 = t2 * t2 * (grad2[gi2][0] * x2 + grad2[gi2][1] * y2);
    }
    return 70.0 * (n0 + n1 + n2);
  }

  // Fractal Brownian Motion (Multi-octave noise)
  function fbm(x: number, y: number, octaves = 4): number {
    let val = 0;
    let amp = 0.5;
    let freq = 1.0;
    for (let i = 0; i < octaves; i++) {
      val += amp * simplex2(x * freq, y * freq);
      freq *= 2.05;
      amp *= 0.5;
    }
    return val;
  }

  // Domain Warping: fbm(p + fbm(p)) for liquid fluid noise
  function warpedNoise(x: number, y: number, t: number): number {
    const qx = fbm(x + t * 0.05, y + t * 0.03, 3);
    const qy = fbm(x + 5.2 + t * 0.04, y + 1.3 - t * 0.02, 3);
    const rx = fbm(x + 4.0 * qx + 1.7 + t * 0.06, y + 4.0 * qy + 9.2, 3);
    const ry = fbm(x + 4.0 * qx + 8.3, y + 4.0 * qy + 2.8 + t * 0.05, 3);
    return fbm(x + 4.0 * rx, y + 4.0 * ry, 4);
  }

  // Curl Noise for fluid velocity vectors (TouchDesigner particle POP style)
  function curlNoise(x: number, y: number, t: number): [number, number] {
    const eps = 0.01;
    const n1 = fbm(x, y + eps + t * 0.1, 3);
    const n2 = fbm(x, y - eps + t * 0.1, 3);
    const n3 = fbm(x + eps, y + t * 0.1, 3);
    const n4 = fbm(x - eps, y + t * 0.1, 3);
    const dx = (n1 - n2) / (2 * eps);
    const dy = (n3 - n4) / (2 * eps);
    return [dx, -dy];
  }

  // -------------------------------------------------------------
  // OBSTACLES (Text & Pill bounds for physical force fields)
  // -------------------------------------------------------------
  interface Obstacle {
    x: number;
    y: number;
    w: number;
    h: number;
  }
  let obstacles: Obstacle[] = [];

  function updateObstacles() {
    if (!canvas || !animationState.textInteraction) {
      obstacles = [];
      return;
    }
    const parent = canvas.closest('.half, .cover-page');
    if (!parent) return;
    const parentRect = parent.getBoundingClientRect();

    const elements = parent.querySelectorAll('h1, h2, h3, h4, .bd-goal-row, .glass-pill, .glass-breakdown-card, p');
    const obs: Obstacle[] = [];
    elements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const x = rect.left - parentRect.left;
      const y = rect.top - parentRect.top;
      if (rect.width > 0 && rect.height > 0) {
        obs.push({ x, y, w: rect.width, h: rect.height });
      }
    });
    obstacles = obs;
  }

  // -------------------------------------------------------------
  // 1. WATERCOLOR BLOOM (Sumi-e & Capillary Edge Darkening)
  // -------------------------------------------------------------
  interface InkDrop {
    x: number;
    y: number;
    r: number;
    maxR: number;
    color: string;
    rimColor: string;
    opacity: number;
    layers: { rMult: number; pts: { angle: number; rad: number }[] }[];
  }
  let inkDrops: InkDrop[] = [];

  function createInkDrop(x?: number, y?: number) {
    const dropX = x ?? (Math.random() * (width - 100) + 50);
    const dropY = y ?? (Math.random() * (height - 100) + 50);
    const maxR = Math.random() * 60 + 40;

    let core = 'rgba(25, 30, 45, ';
    let rim = 'rgba(15, 18, 28, ';
    if (animationState.palette === 'warm') {
      core = 'rgba(180, 80, 30, ';
      rim = 'rgba(110, 40, 15, ';
    } else if (animationState.palette === 'cool') {
      core = 'rgba(30, 90, 160, ';
      rim = 'rgba(15, 45, 90, ';
    } else if (animationState.palette === 'eink') {
      core = 'rgba(40, 40, 45, ';
      rim = 'rgba(15, 15, 20, ';
    }

    const numPts = 32;
    const layers = [];
    for (let l = 0; l < 3; l++) {
      const pts = [];
      const seed = Math.random() * 100;
      for (let i = 0; i < numPts; i++) {
        const angle = (i / numPts) * Math.PI * 2;
        const noise = fbm(Math.cos(angle) * 1.5 + seed, Math.sin(angle) * 1.5 + seed, 3);
        pts.push({ angle, rad: 1.0 + noise * 0.45 });
      }
      layers.push({ rMult: 1.0 - l * 0.25, pts });
    }

    inkDrops.push({
      x: dropX,
      y: dropY,
      r: 3,
      maxR,
      color: core,
      rimColor: rim,
      opacity: Math.random() * 0.22 + 0.14,
      layers
    });
  }

  function drawWatercolor(c: CanvasRenderingContext2D) {
    if (inkDrops.length < 9 && Math.random() < 0.02) {
      createInkDrop();
    }

    for (let i = inkDrops.length - 1; i >= 0; i--) {
      const drop = inkDrops[i];
      if (drop.r < drop.maxR) {
        drop.r += animationState.speed * 0.45;
      }

      c.save();
      // Draw 3 nested capillary pigment layers (gives real watercolor body)
      drop.layers.forEach((layer, idx) => {
        const currentR = drop.r * layer.rMult;
        c.fillStyle = drop.color + (drop.opacity * (idx === 0 ? 0.35 : 0.7)) + ')';
        c.beginPath();
        layer.pts.forEach((pt, j) => {
          const px = drop.x + Math.cos(pt.angle) * currentR * pt.rad;
          const py = drop.y + Math.sin(pt.angle) * currentR * pt.rad;
          if (j === 0) c.moveTo(px, py);
          else c.lineTo(px, py);
        });
        c.closePath();
        c.fill();
      });

      // Realistic "Coffee-ring" edge darkening
      const outerLayer = drop.layers[0];
      c.strokeStyle = drop.rimColor + (drop.opacity * 1.2) + ')';
      c.lineWidth = 1.5;
      c.beginPath();
      outerLayer.pts.forEach((pt, j) => {
        const px = drop.x + Math.cos(pt.angle) * drop.r * pt.rad;
        const py = drop.y + Math.sin(pt.angle) * drop.r * pt.rad;
        if (j === 0) c.moveTo(px, py);
        else c.lineTo(px, py);
      });
      c.closePath();
      c.stroke();
      c.restore();

      if (drop.r >= drop.maxR) {
        drop.opacity -= 0.00025 * animationState.speed;
        if (drop.opacity <= 0) inkDrops.splice(i, 1);
      }
    }
  }

  // -------------------------------------------------------------
  // 2. ATMOSPHERIC NEBULA & CLOUDS (TouchDesigner fBm Domain-Warped Grid)
  // -------------------------------------------------------------
  let offCanvas: HTMLCanvasElement | null = null;
  let offCtx: CanvasRenderingContext2D | null = null;
  const GRID_W = 120;
  const GRID_H = 80;
  let imgData: ImageData | null = null;

  function initCloudsBuffer() {
    offCanvas = document.createElement('canvas');
    offCanvas.width = GRID_W;
    offCanvas.height = GRID_H;
    offCtx = offCanvas.getContext('2d');
    if (offCtx) {
      imgData = offCtx.createImageData(GRID_W, GRID_H);
    }
  }

  function drawClouds(c: CanvasRenderingContext2D, time: number) {
    if (!offCtx || !imgData || !offCanvas) {
      initCloudsBuffer();
      if (!offCtx || !imgData || !offCanvas) return;
    }

    const t = time * 0.0004 * animationState.speed;
    const data = imgData.data;

    let rBase = 180, gBase = 195, bBase = 215;
    if (animationState.palette === 'warm') { rBase = 220; gBase = 185; bBase = 160; }
    else if (animationState.palette === 'cool') { rBase = 140; gBase = 180; bBase = 230; }
    else if (animationState.palette === 'eink') { rBase = 130; gBase = 130; bBase = 135; }

    // Fast raster evaluation of domain-warped volumetric clouds
    let idx = 0;
    for (let y = 0; y < GRID_H; y++) {
      const ny = (y / GRID_H) * 2.2;
      for (let x = 0; x < GRID_W; x++) {
        const nx = (x / GRID_W) * 3.3;
        
        // Multi-scale domain warped noise (true TouchDesigner Noise TOP formula)
        const val = warpedNoise(nx, ny, t);
        // Soft curve mapping for cloud puff contrast
        const cloudDensity = Math.max(0, Math.min(1, (val + 0.4) * 0.9));
        const alpha = Math.floor(cloudDensity * cloudDensity * 120);

        data[idx]     = rBase;
        data[idx + 1] = gBase;
        data[idx + 2] = bBase;
        data[idx + 3] = alpha;
        idx += 4;
      }
    }

    offCtx.putImageData(imgData, 0, 0);

    // Render scaled smoothly with bilinear interpolation
    c.save();
    c.imageSmoothingEnabled = true;
    c.drawImage(offCanvas, 0, 0, width, height);

    // Overlay ethereal harmonic stream wisps for cirrus depth
    c.strokeStyle = `rgba(${rBase + 20}, ${gBase + 20}, ${bBase + 20}, 0.18)`;
    c.lineWidth = 1.8;
    for (let j = 0; j < 5; j++) {
      const waveY = (j + 1) * (height / 6);
      c.beginPath();
      for (let px = 0; px < width; px += 15) {
        const py = waveY + fbm((px * 0.003) + t, (waveY * 0.003) + j * 10, 3) * 60;
        if (px === 0) c.moveTo(px, py);
        else c.lineTo(px, py);
      }
      c.stroke();
    }
    c.restore();
  }

  // -------------------------------------------------------------
  // 3. EMBER HEARTH & KINETIC FIRE (Thermal Convection + Curl Noise)
  // -------------------------------------------------------------
  interface Ember {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    life: number;
    maxLife: number;
    temp: number; // 1.0 (white hot) -> 0.0 (dark smoke)
  }
  let embers: Ember[] = [];

  function spawnEmber(x?: number, y?: number, burst = false) {
    const spawnX = x ?? (Math.random() * (width - 40) + 20);
    const spawnY = y ?? (height + Math.random() * 15);
    embers.push({
      x: spawnX,
      y: spawnY,
      vx: (Math.random() - 0.5) * (burst ? 4.5 : 1.2),
      vy: burst ? (Math.random() - 0.5) * 4 - 2.5 : -Math.random() * 2.8 - 1.2,
      size: Math.random() * 3.5 + 1.2,
      life: 0,
      maxLife: Math.random() * 100 + 70,
      temp: 1.0
    });
  }

  function drawFire(c: CanvasRenderingContext2D, time: number) {
    if (embers.length < 110) {
      for (let i = 0; i < 3; i++) spawnEmber();
    }

    const t = time * 0.002;

    // Convective flame base tongue shapes along the bottom margin
    c.save();
    const baseCol = animationState.palette === 'cool' ? '40, 110, 210' : '230, 80, 20';
    for (let f = 0; f < 6; f++) {
      const fx = (f / 5) * width;
      const grad = c.createRadialGradient(fx, height + 10, 0, fx, height - 80, 130);
      grad.addColorStop(0, `rgba(${baseCol}, 0.28)`);
      grad.addColorStop(0.6, `rgba(${baseCol}, 0.08)`);
      grad.addColorStop(1, `rgba(${baseCol}, 0)`);
      c.fillStyle = grad;
      c.beginPath();
      c.arc(fx, height + 10, 130, 0, Math.PI * 2);
      c.fill();
    }

    // Update & draw flame embers with turbulent Curl Noise
    for (let i = embers.length - 1; i >= 0; i--) {
      const e = embers[i];
      e.life += animationState.speed;
      e.temp = Math.max(0, 1 - (e.life / e.maxLife));

      // Curl Noise thermal updraft
      const [cx, cy] = curlNoise(e.x * 0.004, e.y * 0.004, t);
      e.vx += cx * 0.4 * animationState.speed;
      e.vy += (cy * 0.2 - 0.06) * animationState.speed;
      e.vx *= 0.94;
      e.vy *= 0.96;

      e.x += e.vx * animationState.speed;
      e.y += e.vy * animationState.speed;

      // Obstacle force deflection
      obstacles.forEach((obs) => {
        if (e.x > obs.x - 12 && e.x < obs.x + obs.w + 12 && e.y > obs.y - 12 && e.y < obs.y + obs.h + 12) {
          e.vx += (e.x < obs.x + obs.w / 2 ? -1.2 : 1.2);
          e.vy *= 0.7;
        }
      });

      // Color gradation by temperature
      let color = '';
      if (animationState.palette === 'cool') {
        if (e.temp > 0.7) color = `rgba(220, 240, 255, ${e.temp})`;
        else if (e.temp > 0.3) color = `rgba(60, 160, 255, ${e.temp})`;
        else color = `rgba(20, 50, 120, ${e.temp * 0.6})`;
      } else if (animationState.palette === 'eink') {
        color = `rgba(40, 40, 45, ${e.temp * 0.8})`;
      } else {
        if (e.temp > 0.75) color = `rgba(255, 245, 180, ${e.temp})`;
        else if (e.temp > 0.4) color = `rgba(255, 120, 20, ${e.temp})`;
        else color = `rgba(160, 30, 10, ${e.temp * 0.7})`;
      }

      c.fillStyle = color;
      c.beginPath();
      c.arc(e.x, e.y, e.size * (0.6 + e.temp * 0.6), 0, Math.PI * 2);
      c.fill();

      if (e.life >= e.maxLife || e.y < -30) embers.splice(i, 1);
    }
    c.restore();
  }

  // -------------------------------------------------------------
  // 4. E-INK MAGNETIC PARTICLE FIELD (Faraday Flux Lines & Trails)
  // -------------------------------------------------------------
  interface MagParticle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    trail: { x: number; y: number }[];
  }
  let magParticles: MagParticle[] = [];

  function initMagnetic() {
    magParticles = [];
    for (let i = 0; i < 160; i++) {
      magParticles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: 0,
        vy: 0,
        trail: []
      });
    }
  }

  function drawMagnetic(c: CanvasRenderingContext2D, time: number) {
    if (magParticles.length === 0) initMagnetic();

    const t = time * 0.001;
    const col = animationState.palette === 'warm' 
      ? 'rgba(90, 50, 20, ' 
      : animationState.palette === 'cool' 
      ? 'rgba(30, 80, 150, ' 
      : 'rgba(25, 25, 30, ';

    c.lineWidth = 1.2;

    magParticles.forEach((p) => {
      // Flow along magnetic dipole vector field with curl noise modulation
      const [cx, cy] = curlNoise(p.x * 0.0035, p.y * 0.0035, t);
      p.vx = (p.vx * 0.9) + cx * 2.2 * animationState.speed;
      p.vy = (p.vy * 0.9) + cy * 2.2 * animationState.speed;

      p.x += p.vx;
      p.y += p.vy;

      // Wrap around bounds
      if (p.x < 0) { p.x = width; p.trail = []; }
      if (p.x > width) { p.x = 0; p.trail = []; }
      if (p.y < 0) { p.y = height; p.trail = []; }
      if (p.y > height) { p.y = 0; p.trail = []; }

      // Text obstacle deflection
      obstacles.forEach((obs) => {
        if (p.x > obs.x - 15 && p.x < obs.x + obs.w + 15 && p.y > obs.y - 15 && p.y < obs.y + obs.h + 15) {
          const dx = p.x - (obs.x + obs.w / 2);
          const dy = p.y - (obs.y + obs.h / 2);
          p.vx += dx * 0.05;
          p.vy += dy * 0.05;
        }
      });

      // Pointer magnetic pole disturbance
      if (animationState.pointerInteraction && mouseX > 0 && mouseY > 0) {
        const dx = p.x - mouseX;
        const dy = p.y - mouseY;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 140) {
          p.vx += (dx / d) * 1.5;
          p.vy += (dy / d) * 1.5;
        }
      }

      // Record trail
      p.trail.push({ x: p.x, y: p.y });
      if (p.trail.length > 7) p.trail.shift();

      // Render ribbon stream trail (p5.js vector field trail style)
      if (p.trail.length > 1) {
        c.strokeStyle = col + '0.45)';
        c.beginPath();
        c.moveTo(p.trail[0].x, p.trail[0].y);
        for (let k = 1; k < p.trail.length; k++) {
          c.lineTo(p.trail[k].x, p.trail[k].y);
        }
        c.stroke();
      }

      // Particle node
      c.fillStyle = col + '0.85)';
      c.beginPath();
      c.arc(p.x, p.y, 1.6, 0, Math.PI * 2);
      c.fill();
    });
  }

  // -------------------------------------------------------------
  // 5. LIQUID PROVENANCE STREAMS (Topological DAG Soliton Pulses)
  // -------------------------------------------------------------
  interface StreamDAG {
    startY: number;
    endY: number;
    cp1x: number;
    cp1y: number;
    cp2x: number;
    cp2y: number;
    pulses: { progress: number; speed: number; size: number }[];
  }
  let streams: StreamDAG[] = [];

  function initStreams() {
    streams = [];
    const count = 7;
    for (let i = 0; i < count; i++) {
      const startY = (i + 0.8) * (height / (count + 1));
      const endY = startY + (Math.random() - 0.5) * 80;
      streams.push({
        startY,
        endY,
        cp1x: width * 0.35,
        cp1y: startY + (Math.random() - 0.5) * 120,
        cp2x: width * 0.65,
        cp2y: endY + (Math.random() - 0.5) * 120,
        pulses: [
          { progress: Math.random(), speed: Math.random() * 0.004 + 0.003, size: Math.random() * 3 + 2.5 },
          { progress: (Math.random() + 0.5) % 1, speed: Math.random() * 0.004 + 0.003, size: Math.random() * 2 + 2 }
        ]
      });
    }
  }

  function getBezierPoint(t: number, p0: number, p1: number, p2: number, p3: number) {
    const mt = 1 - t;
    return mt * mt * mt * p0 + 3 * mt * mt * t * p1 + 3 * mt * t * t * p2 + t * t * t * p3;
  }

  function drawStreams(c: CanvasRenderingContext2D) {
    if (streams.length === 0 || Math.abs(height - (streams[0]?.startY * 8)) > 150) initStreams();

    const mainCol = animationState.palette === 'warm' ? '230, 130, 40' : '40, 150, 245';
    const subCol = animationState.palette === 'warm' ? '160, 70, 20' : '20, 80, 180';

    streams.forEach((s) => {
      // Draw faint topological DAG streamline
      c.strokeStyle = `rgba(${subCol}, 0.18)`;
      c.lineWidth = 1.2;
      c.beginPath();
      c.moveTo(0, s.startY);
      c.bezierCurveTo(s.cp1x, s.cp1y, s.cp2x, s.cp2y, width, s.endY);
      c.stroke();

      // Soliton energy pulses traveling along stream
      s.pulses.forEach((pulse) => {
        pulse.progress += pulse.speed * animationState.speed;
        if (pulse.progress > 1) pulse.progress = 0;

        const px = getBezierPoint(pulse.progress, 0, s.cp1x, s.cp2x, width);
        const py = getBezierPoint(pulse.progress, s.startY, s.cp1y, s.cp2y, s.endY);

        // Glowing pulse head
        const grad = c.createRadialGradient(px, py, 0, px, py, pulse.size * 3);
        grad.addColorStop(0, `rgba(${mainCol}, 0.85)`);
        grad.addColorStop(0.5, `rgba(${mainCol}, 0.3)`);
        grad.addColorStop(1, `rgba(${mainCol}, 0)`);
        c.fillStyle = grad;
        c.beginPath();
        c.arc(px, py, pulse.size * 3, 0, Math.PI * 2);
        c.fill();

        // Crisp center node
        c.fillStyle = '#ffffff';
        c.beginPath();
        c.arc(px, py, pulse.size * 0.6, 0, Math.PI * 2);
        c.fill();
      });
    });
  }

  // -------------------------------------------------------------
  // 6. PRISMATIC RAINBOW (Spectral Optical Ribbons & Caustics — NO CIRCLES)
  // -------------------------------------------------------------
  function drawRainbow(c: CanvasRenderingContext2D, time: number) {
    const t = time * 0.0004 * animationState.speed;
    const numBands = 55; // Dense overlapping chromatic bands
    
    c.save();
    c.globalCompositeOperation = 'source-over';

    for (let r = 0; r < numBands; r++) {
      const bandProgress = r / numBands;
      // Cycle through the spectrum continuously over time
      const hue = (bandProgress * 360 + t * 40) % 360;
      const sat = animationState.palette === 'eink' ? 0 : 80;
      const light = animationState.palette === 'eink' ? 40 : 55;
      
      // Draw 3 layers per band with increasing thickness and decreasing opacity for a watercolor bleed effect
      for (let pass = 0; pass < 3; pass++) {
        c.beginPath();
        let first = true;
        for (let x = -50; x <= width + 50; x += 15) {
          // Domain warping with fbm for fluid TouchDesigner feel
          const noiseVal = fbm(x * 0.0015 - t * 0.1, bandProgress * 1.5 + t * 0.2 + (pass * 0.05), 3);
          // Base sine wave + noise displacement
          const yOffset = Math.sin(x * 0.002 + t + bandProgress * 5) * 60 + noiseVal * 180;
          
          let y = (height * 1.2) * bandProgress - (height * 0.1) + yOffset;

          // Vertical spread to simulate wet edge capillary bleeding
          y += (pass - 1) * 15 * noiseVal;

          // Pointer refraction distortion
          if (animationState.pointerInteraction && mouseX > 0 && mouseY > 0) {
            const dx = x - mouseX;
            const dy = y - mouseY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 180) {
              const force = Math.pow((180 - dist) / 180, 2);
              y += Math.sin(dist * 0.05 - t * 5) * force * 60;
            }
          }

          if (first) {
            c.moveTo(x, y);
            first = false;
          } else {
            c.lineTo(x, y);
          }
        }

        // Soft, highly transparent watercolor passes
        const alpha = pass === 0 ? 0.25 : 0.08;
        c.strokeStyle = `hsla(${hue}, ${sat}%, ${light}%, ${alpha})`;
        
        // Base width overlaps, and outer passes get much thicker to create a soft blurry edge
        const baseWidth = (height / numBands) * 2.0;
        c.lineWidth = baseWidth + (pass * baseWidth * 1.2); 
        c.lineJoin = 'round';
        c.lineCap = 'round';
        c.stroke();
      }
    }
    
    c.restore();
  }

  // -------------------------------------------------------------
  // ANIMATION LOOP & EVENT LISTENERS
  // -------------------------------------------------------------
  function render(time: number) {
    if (!ctx || animationState.preset === 'off') return;

    ctx.clearRect(0, 0, width, height);
    ctx.globalAlpha = animationState.intensity;

    if (animationState.preset === 'watercolor') {
      drawWatercolor(ctx);
    } else if (animationState.preset === 'clouds') {
      drawClouds(ctx, time);
    } else if (animationState.preset === 'fire') {
      drawFire(ctx, time);
    } else if (animationState.preset === 'particles') {
      drawMagnetic(ctx, time);
    } else if (animationState.preset === 'streams') {
      drawStreams(ctx);
    } else if (animationState.preset === 'rainbow') {
      drawRainbow(ctx, time);
    }

    ctx.globalAlpha = 1.0;
  }

  function loop(time: number) {
    render(time);
    rafId = requestAnimationFrame(loop);
  }

  function resize() {
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (parent) {
      width = parent.clientWidth;
      height = parent.clientHeight;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx?.scale(dpr, dpr);
      updateObstacles();
    }
  }

  $effect(() => {
    void animationState.preset;
    void animationState.textInteraction;
    updateObstacles();
    if (animationState.preset === 'particles') initMagnetic();
    if (animationState.preset === 'streams') initStreams();
  });

  onMount(() => {
    if (canvas) {
      ctx = canvas.getContext('2d');
      resize();
      window.addEventListener('resize', resize);
      
      const parent = canvas.closest('.half, .cover-page') || canvas.parentElement;
      if (parent) {
        parent.addEventListener('mousemove', (e: Event) => {
          const me = e as MouseEvent;
          const rect = parent.getBoundingClientRect();
          mouseX = me.clientX - rect.left;
          mouseY = me.clientY - rect.top;
        });
        parent.addEventListener('mouseleave', () => {
          mouseX = -1000;
          mouseY = -1000;
        });
        parent.addEventListener('click', (e: Event) => {
          const me = e as MouseEvent;
          const rect = parent.getBoundingClientRect();
          const cx = me.clientX - rect.left;
          const cy = me.clientY - rect.top;
          if (animationState.preset === 'watercolor') {
            createInkDrop(cx, cy);
          } else if (animationState.preset === 'fire') {
            for (let i = 0; i < 18; i++) spawnEmber(cx, cy, true);
          }
        });
      }

      rafId = requestAnimationFrame(loop);
    }
  });

  onDestroy(() => {
    cancelAnimationFrame(rafId);
    window.removeEventListener('resize', resize);
  });
</script>

<canvas 
  bind:this={canvas} 
  class="page-canvas" 
  class:screen-blend={['rainbow', 'fire', 'particles'].includes(animationState.preset)}
  style="display: {animationState.preset === 'off' ? 'none' : 'block'};"
></canvas>

<style>
  .page-canvas {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 0;
    mix-blend-mode: multiply;
  }

  .screen-blend {
    mix-blend-mode: screen !important;
  }

  :global(.theme-eink-dark .page-canvas) {
    mix-blend-mode: screen;
  }
  :global(.theme-high-contrast .page-canvas) {
    mix-blend-mode: normal;
  }
</style>
