<script lang="ts">
  import { onMount } from 'svelte';
  import { gsap } from 'gsap';

  let sectionEl: HTMLElement;
  let canvasEl: HTMLCanvasElement;
  let legibility = $state(0);

  // Dot simulation state
  const NUM_DOTS = 180;
  let dots: Array<{
    x: number; y: number;
    gridX: number; gridY: number;
    vx: number; vy: number;
    hue: number;
  }> = [];

  let animId: number;

  onMount(() => {
    // Fade in
    gsap.from(sectionEl, { opacity: 0, y: 20, duration: 0.6, ease: 'power2.out' });

    // Init dots
    const W = canvasEl.width;
    const H = canvasEl.height;
    for (let i = 0; i < NUM_DOTS; i++) {
      const col = i % 14;
      const row = Math.floor(i / 14);
      dots.push({
        x: Math.random() * W,
        y: Math.random() * H,
        gridX: 50 + (col / 13) * (W - 100),
        gridY: 30 + (row / Math.floor(NUM_DOTS / 14)) * (H - 60),
        vx: (Math.random() - 0.5) * 3,
        vy: (Math.random() - 0.5) * 3,
        hue: Math.random() * 360,
      });
    }

    const ctx = canvasEl.getContext('2d')!;
    function draw() {
      ctx.clearRect(0, 0, W, H);
      const t = legibility;

      for (const d of dots) {
        const chaos = 1 - t;
        d.vx += (Math.random() - 0.5) * 0.4 * chaos;
        d.vy += (Math.random() - 0.5) * 0.4 * chaos;
        d.vx *= 0.97;
        d.vy *= 0.97;

        const speed = 1 - t * 0.95;
        d.x = d.x + d.vx * speed + (d.gridX - d.x) * t * 0.06;
        d.y = d.y + d.vy * speed + (d.gridY - d.y) * t * 0.06;

        if (d.x < -10) d.x = W + 10;
        if (d.x > W + 10) d.x = -10;
        if (d.y < -10) d.y = H + 10;
        if (d.y > H + 10) d.y = -10;

        const radius = 1.5 + t * 2.5;
        const alpha = 0.2 + t * 0.65;
        const sat = t * 65;
        const hueShift = t > 0.3 ? d.hue * 0.3 : 0;

        ctx.beginPath();
        ctx.arc(d.x, d.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${220 + hueShift}, ${sat}%, ${55}%, ${alpha})`;
        ctx.fill();
      }

      animId = requestAnimationFrame(draw);
    }

    draw();
    return () => cancelAnimationFrame(animId);
  });
</script>

<section bind:this={sectionEl}>
  <div class="page">
    <p class="chapter-label">Chapter 1</p>
    <h2>The Problem of Legibility</h2>

    <p>
      Tensor operations unfold in nanoseconds. Gradient flows cascade through
      billions of parameters. Attention patterns shift across token sequences
      in ways that have no natural visual or auditory analog. The result is a
      growing gap between what machines compute and what humans can understand.
    </p>

    <p>
      Recent research on human-AI feedback loops (Glickman & Sharot, 2025)
      demonstrates that this gap is not passive: small biases amplify through
      repeated interaction, reshaping perception, emotion, and social judgment
      in ways neither party intended.
    </p>

    <figure>
      <div style="padding: 1.25rem;">
        <canvas bind:this={canvasEl} width="520" height="300"></canvas>
      </div>
      <div style="padding: 0 1.25rem 0.75rem; font-family: var(--font-sans); font-size: 0.82rem; color: var(--text-muted); text-align: center;">
        <label>
          Legibility
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            bind:value={legibility}
            style="width: 140px; margin-left: 0.5rem;"
          />
          <span style="font-family: var(--font-mono); font-size: 0.75rem; margin-left: 0.4rem;">
            {legibility.toFixed(2)}
          </span>
        </label>
      </div>
      <figcaption>
        <strong>Figure 1.</strong> Opacity to legibility. At low legibility,
        computation is chaotic and invisible. As legibility increases, structure emerges.
      </figcaption>
    </figure>

    <p>
      Vibrational Codex addresses this gap by building a bridge between
      computational process and embodied perception. The project treats AI
      inference not as an abstract mathematical event but as a physical
      phenomenon, one that produces energy signatures that can be captured,
      transformed, and rendered as human-perceivable vibration.
    </p>

    <div class="section-break">· · ·</div>
  </div>
</section>
