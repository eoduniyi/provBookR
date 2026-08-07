<script lang="ts">
  import { onMount } from 'svelte';
  import { gsap } from 'gsap';

  let sectionEl: HTMLElement;
  let canvasEl: HTMLCanvasElement;
  let confidence = $state(0.8);
  let animId: number;

  function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }

  onMount(() => {
    gsap.from(sectionEl, { opacity: 0, y: 20, duration: 0.6, ease: 'power2.out' });

    const W = 520, H = 340;
    const ctx = canvasEl.getContext('2d')!;

    const traceLen = 100;
    const traceLeft = new Float32Array(traceLen);
    const traceRight = new Float32Array(traceLen);
    let traceIdx = 0;

    function draw(time: number) {
      ctx.clearRect(0, 0, W, H);
      const t = time / 1000;

      const leftCx = W / 4 + 10;
      const rightCx = (W * 3) / 4 - 10;
      const cy = 130;
      const maxR = 60;

      // Labels
      ctx.font = '11px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.textAlign = 'center';
      ctx.fillText('Confident', leftCx, 30);
      ctx.fillText('Uncertain', rightCx, 30);

      // Left: confident circle
      const confPulse = Math.sin(t * 2.5) * 0.1 + 0.9;
      const confR = maxR * confPulse * lerp(0.5, 1, confidence);
      const confBright = lerp(0.3, 0.9, confidence);
      const confHue = lerp(220, 210, confidence);

      const gL = ctx.createRadialGradient(leftCx, cy, 0, leftCx, cy, confR * 2);
      gL.addColorStop(0, `hsla(${confHue}, 70%, 55%, ${confBright * 0.5})`);
      gL.addColorStop(0.6, `hsla(${confHue}, 60%, 50%, ${confBright * 0.15})`);
      gL.addColorStop(1, `hsla(${confHue}, 50%, 45%, 0)`);
      ctx.fillStyle = gL;
      ctx.fillRect(leftCx - confR * 2, cy - confR * 2, confR * 4, confR * 4);

      ctx.beginPath();
      ctx.arc(leftCx, cy, confR, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${confHue}, 75%, ${40 + confBright * 25}%, ${confBright})`;
      ctx.fill();

      // Right: uncertain circle
      const uncConf = 1 - confidence;
      const jitter = uncConf * 8;
      const uncR = maxR * (0.5 + uncConf * 0.3) +
        Math.sin(t * 7) * jitter + Math.sin(t * 11) * jitter * 0.5;
      const uncBright = lerp(0.3, 0.7, uncConf);
      const uncJX = Math.sin(t * 9.3) * jitter * 0.5;
      const uncJY = Math.cos(t * 7.7) * jitter * 0.5;

      const gR = ctx.createRadialGradient(
        rightCx + uncJX, cy + uncJY, 0,
        rightCx + uncJX, cy + uncJY, Math.abs(uncR) * 2
      );
      gR.addColorStop(0, `hsla(30, 50%, 55%, ${uncBright * 0.4})`);
      gR.addColorStop(0.6, `hsla(30, 40%, 50%, ${uncBright * 0.1})`);
      gR.addColorStop(1, `hsla(30, 30%, 45%, 0)`);
      ctx.fillStyle = gR;
      ctx.fillRect(rightCx - maxR * 2, cy - maxR * 2, maxR * 4, maxR * 4);

      ctx.beginPath();
      ctx.arc(rightCx + uncJX, cy + uncJY, Math.max(10, Math.abs(uncR)), 0, Math.PI * 2);
      ctx.fillStyle = `hsla(30, 50%, ${40 + uncBright * 20}%, ${uncBright})`;
      ctx.fill();

      // Haptic traces
      const traceY = 240, traceH = 35, traceW = 180;

      const leftVal = Math.sin(t * 2.5) * confidence * 0.8;
      const rightVal = Math.sin(t * 7) * uncConf * 0.5 +
        Math.sin(t * 11) * uncConf * 0.3 +
        (Math.random() - 0.5) * uncConf * 0.4;
      traceLeft[traceIdx % traceLen] = leftVal;
      traceRight[traceIdx % traceLen] = rightVal;
      traceIdx++;

      ctx.font = '9px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.textAlign = 'center';
      ctx.fillText('haptic pattern', leftCx, traceY - 10);
      ctx.fillText('haptic pattern', rightCx, traceY - 10);

      // Left trace
      ctx.beginPath();
      ctx.strokeStyle = 'hsla(210, 70%, 55%, 0.6)';
      ctx.lineWidth = 1.5;
      const lStartX = leftCx - traceW / 2;
      for (let i = 0; i < traceLen; i++) {
        const idx = (traceIdx - traceLen + i + traceLen * 2) % traceLen;
        const x = lStartX + (i / traceLen) * traceW;
        const y = traceY + 25 + traceLeft[idx] * traceH;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Right trace
      ctx.beginPath();
      ctx.strokeStyle = 'hsla(30, 50%, 55%, 0.6)';
      ctx.lineWidth = 1.5;
      const rStartX = rightCx - traceW / 2;
      for (let i = 0; i < traceLen; i++) {
        const idx = (traceIdx - traceLen + i + traceLen * 2) % traceLen;
        const x = rStartX + (i / traceLen) * traceW;
        const y = traceY + 25 + traceRight[idx] * traceH;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Baselines
      ctx.strokeStyle = '#e5e7eb';
      ctx.lineWidth = 0.5;
      ctx.beginPath(); ctx.moveTo(lStartX, traceY + 25); ctx.lineTo(lStartX + traceW, traceY + 25); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(rStartX, traceY + 25); ctx.lineTo(rStartX + traceW, traceY + 25); ctx.stroke();

      animId = requestAnimationFrame(draw);
    }

    animId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animId);
  });
</script>

<section bind:this={sectionEl}>
  <div class="page">
    <p class="chapter-label">Chapter 4</p>
    <h2>Confidence &amp; Uncertainty</h2>

    <p>
      The installation makes legible the difference between a confident
      response and an uncertain one, between a familiar pattern and a novel
      one, between retrieval and generation.
    </p>

    <p>
      A confident inference produces stable, bright, rhythmic patterns.
      Uncertainty produces jittery, dim, erratic ones. The visitor doesn't
      need to read a probability score — they <em>feel</em> the difference.
    </p>

    <figure>
      <div style="padding: 1.25rem;">
        <canvas bind:this={canvasEl} width="520" height="340"></canvas>
      </div>
      <div style="padding: 0 1.25rem 0.75rem; font-family: var(--font-sans); font-size: 0.82rem; color: var(--text-muted);">
        <label>
          Confidence
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            bind:value={confidence}
            style="width: 140px; margin-left: 0.5rem;"
          />
          <span style="font-family: var(--font-mono); font-size: 0.75rem; margin-left: 0.4rem;">
            {confidence.toFixed(2)}
          </span>
        </label>
      </div>
      <figcaption>
        <strong>Figure 4.</strong> Confidence vs. uncertainty. Stable, bright
        patterns (left) contrast with jittery, erratic ones (right).
      </figcaption>
    </figure>

    <div class="section-break">· · ·</div>
  </div>
</section>
