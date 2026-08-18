<script lang="ts">
  import { onMount } from 'svelte';
  import { gsap } from 'gsap';

  let sectionEl: HTMLElement;
  let canvasEl: HTMLCanvasElement;
  let domain = $state<'light' | 'sound' | 'haptic'>('light');
  let animId: number;

  onMount(() => {
    gsap.from(sectionEl, { opacity: 0, y: 20, duration: 0.6, ease: 'power2.out' });

    const W = 520, H = 300;
    const ctx = canvasEl.getContext('2d')!;
    const bufLen = 120;
    const telemetry = new Float32Array(bufLen);
    let bufIdx = 0;

    function clamp(v: number, lo: number, hi: number) { return Math.max(lo, Math.min(hi, v)); }

    function draw(time: number) {
      ctx.clearRect(0, 0, W, H);
      const t = time / 1000;

      // Generate telemetry
      telemetry[bufIdx % bufLen] =
        Math.sin(t * 3) * 0.3 +
        Math.sin(t * 7.3) * 0.2 +
        Math.sin(t * 13.1) * 0.15 +
        (Math.random() - 0.5) * 0.4;
      bufIdx++;

      // Divider
      ctx.strokeStyle = '#e5e7eb';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(W / 2, 30);
      ctx.lineTo(W / 2, H - 30);
      ctx.stroke();
      ctx.setLineDash([]);

      // Arrow
      ctx.fillStyle = '#94a3b8';
      ctx.beginPath();
      ctx.moveTo(W / 2 - 8, H / 2 - 3);
      ctx.lineTo(W / 2 + 8, H / 2);
      ctx.lineTo(W / 2 - 8, H / 2 + 3);
      ctx.fill();

      // Labels
      ctx.font = '10px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.textAlign = 'center';
      ctx.fillText('COMPUTATIONAL TELEMETRY', W / 4, 20);
      ctx.fillText('PERCEPTUAL OUTPUT', (W * 3) / 4, 20);

      // Waveform (left)
      const waveX = 20, waveW = W / 2 - 40, waveY = H / 2, waveH = 80;
      ctx.beginPath();
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1.5;
      for (let i = 0; i < bufLen; i++) {
        const idx = (bufIdx - bufLen + i + bufLen * 2) % bufLen;
        const x = waveX + (i / bufLen) * waveW;
        const y = waveY + telemetry[idx] * waveH;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Current average
      let avg = 0;
      for (let i = 0; i < 10; i++) {
        avg += telemetry[(bufIdx - 1 - i + bufLen * 2) % bufLen];
      }
      avg /= 10;
      const normVal = clamp((avg + 1) / 2, 0, 1);

      const rightCx = (W * 3) / 4;
      const rightCy = H / 2 + 10;

      if (domain === 'light') {
        const brightness = 0.3 + normVal * 0.7;
        const hue = 200 + normVal * 60;
        const radius = 30 + normVal * 30;

        const grad = ctx.createRadialGradient(rightCx, rightCy, 0, rightCx, rightCy, radius * 2);
        grad.addColorStop(0, `hsla(${hue}, 80%, 60%, ${brightness * 0.6})`);
        grad.addColorStop(0.5, `hsla(${hue}, 70%, 50%, ${brightness * 0.2})`);
        grad.addColorStop(1, `hsla(${hue}, 60%, 40%, 0)`);
        ctx.fillStyle = grad;
        ctx.fillRect(rightCx - radius * 2, rightCy - radius * 2, radius * 4, radius * 4);

        ctx.beginPath();
        ctx.arc(rightCx, rightCy, radius, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${hue}, 80%, ${40 + brightness * 30}%, ${brightness})`;
        ctx.fill();

        ctx.font = '10px -apple-system, BlinkMacSystemFont, sans-serif';
        ctx.fillStyle = '#94a3b8';
        ctx.textAlign = 'center';
        ctx.fillText('Attention → Light', rightCx, H - 20);
      } else if (domain === 'sound') {
        const numBars = 16;
        const barW = 10;
        const totalW = numBars * (barW + 3);
        const startX = rightCx - totalW / 2;

        for (let i = 0; i < numBars; i++) {
          const idx = (bufIdx - numBars + i + bufLen * 2) % bufLen;
          const val = clamp((telemetry[idx] + 1) / 2, 0, 1);
          const barH = 10 + val * 100;
          const hue = 200 + i * 10;
          ctx.fillStyle = `hsla(${hue}, 60%, 55%, 0.8)`;
          ctx.fillRect(startX + i * (barW + 3), rightCy + 50 - barH, barW, barH);
        }

        ctx.font = '10px -apple-system, BlinkMacSystemFont, sans-serif';
        ctx.fillStyle = '#94a3b8';
        ctx.textAlign = 'center';
        ctx.fillText('Gradient → Sound', rightCx, H - 20);
      } else {
        const intensity = normVal;
        const pulseR = 25 + intensity * 35 + Math.sin(t * 8) * intensity * 10;

        ctx.beginPath();
        ctx.arc(rightCx, rightCy, pulseR, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(139, 92, 246, ${0.3 + intensity * 0.5})`;
        ctx.lineWidth = 2 + intensity * 4;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(rightCx, rightCy, pulseR * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(139, 92, 246, ${0.2 + intensity * 0.4})`;
        ctx.fill();

        for (let r = 1; r <= 3; r++) {
          const rippleR = pulseR + r * 15 + Math.sin(t * 6 + r) * 5;
          ctx.beginPath();
          ctx.arc(rightCx, rightCy, rippleR, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(139, 92, 246, ${0.15 / r})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        ctx.font = '10px -apple-system, BlinkMacSystemFont, sans-serif';
        ctx.fillStyle = '#94a3b8';
        ctx.textAlign = 'center';
        ctx.fillText('Memory → Haptic', rightCx, H - 20);
      }

      animId = requestAnimationFrame(draw);
    }

    animId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animId);
  });
</script>

<section bind:this={sectionEl}>
  <div class="page">
    <p class="chapter-label">Chapter 3</p>
    <h2>The Expression Framework</h2>

    <p>
      At the heart of Vibrational Codex is <em>ai expressions</em>, a formal
      framework derived from category theory, information theory, and graph
      signal processing that formalizes how computational processes can be
      described, composed, and translated across representational domains.
    </p>

    <p>
      The framework ensures that perceptual translations are not arbitrary
      sonifications or decorative visualizations, but
      information-theoretically faithful renderings of actual computational
      structure.
    </p>

    <div class="note">
      What you see and hear is mathematically faithful to what the machine is
      doing. The mapping framework preserves the entropy structure of the
      computational source.
    </div>

    <figure>
      <div style="padding: 1.25rem;">
        <canvas bind:this={canvasEl} width="520" height="300"></canvas>
      </div>
      <div style="padding: 0 1.25rem 0.75rem; font-family: var(--font-sans); font-size: 0.82rem; color: var(--text-muted);">
        <label>
          Domain
          <select bind:value={domain} style="margin-left: 0.5rem; font-family: var(--font-sans); font-size: 0.78rem; padding: 0.25rem 0.5rem; border: 1px solid var(--border); border-radius: 4px;">
            <option value="light">Attention → Light</option>
            <option value="sound">Gradient → Sound</option>
            <option value="haptic">Memory → Haptic</option>
          </select>
        </label>
      </div>
      <figcaption>
        <strong>Figure 3.</strong> Signal-to-perception mapping. Computational
        telemetry (left) is transformed into perceptual output (right) through
        the expression framework.
      </figcaption>
    </figure>

    <div class="section-break">· · ·</div>
  </div>
</section>
