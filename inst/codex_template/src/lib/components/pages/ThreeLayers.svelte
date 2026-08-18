<script lang="ts">
  import { onMount } from 'svelte';
  import { gsap } from 'gsap';

  let sectionEl: HTMLElement;

  onMount(() => {
    gsap.from(sectionEl, { opacity: 0, y: 20, duration: 0.6, ease: 'power2.out' });
  });
</script>

<section bind:this={sectionEl}>
  <div class="page">
    <p class="chapter-label">Chapter 2</p>
    <h2>The Three Layers</h2>

    <p>
      The system operates at three layers, each responsible for a distinct
      stage of the translation from computation to perception. Together they
      form a pipeline: raw telemetry enters at the bottom, passes through
      signal processing, and emerges as multi-sensory output that a human body
      can perceive.
    </p>

    <div class="layer-stack">
      <div class="layer interface-layer">
        <div class="layer-label">Interface Layer</div>
        <div class="layer-sub">Perceptual Output</div>
        <div class="layer-tags">light fields · tonal progressions · haptic pulses</div>
      </div>
      <div class="layer-arrow">↑</div>
      <div class="layer expression-layer">
        <div class="layer-label">Expression Layer</div>
        <div class="layer-sub">Signal Processing</div>
        <div class="layer-tags">spectral analysis · entropy mapping · graph signal processing</div>
      </div>
      <div class="layer-arrow">↑</div>
      <div class="layer engine-layer">
        <div class="layer-label">Engine Layer</div>
        <div class="layer-sub">Telemetry Capture</div>
        <div class="layer-tags">attention patterns · gradient flows · memory rhythms · token timing</div>
      </div>
    </div>

    <p>
      <strong>The Engine Layer</strong> captures real-time telemetry from AI
      inference: attention activation patterns, memory allocation rhythms,
      gradient magnitudes, and the stochastic timing of token generation.
      The engine is model-agnostic — it can instrument open-weight models
      like Gemma, Nemotron, or Llama running on edge hardware, cloud
      endpoints, or directly on a visitor's phone.
    </p>

    <p>
      <strong>The Expression Layer</strong> applies signal processing
      transformations, governed by a formal framework (<em>ai expressions</em>),
      to map these signals into perceptual domains with information-theoretic
      fidelity. The theoretical foundation draws on rate-distortion theory
      (Tishby et al., 1999) and the free energy principle (Friston, 2010).
    </p>

    <p>
      <strong>The Interface Layer</strong> renders these translations as light,
      sound, and haptic vibration through both a physical installation and a
      distributed platform accessible from anywhere.
    </p>

    <div class="note">
      What you see and hear is mathematically faithful to what the machine is
      doing. The mapping framework preserves the entropy structure of the
      computational source.
    </div>

    <div class="section-break">· · ·</div>
  </div>
</section>

<style>
  .layer-stack {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0;
    margin: 2rem 0;
  }

  .layer {
    width: 100%;
    max-width: 480px;
    padding: 1rem 1.5rem;
    border-radius: 6px;
    border: 1.5px solid;
    text-align: center;
  }

  .engine-layer {
    border-color: #f59e0b;
    background: rgba(245, 158, 11, 0.06);
  }

  .expression-layer {
    border-color: #2563eb;
    background: rgba(37, 99, 235, 0.05);
  }

  .interface-layer {
    border-color: #ef6461;
    background: rgba(239, 100, 97, 0.05);
  }

  .layer-label {
    font-family: var(--font-sans);
    font-weight: 600;
    font-size: 0.95rem;
  }

  .engine-layer .layer-label { color: #f59e0b; }
  .expression-layer .layer-label { color: #2563eb; }
  .interface-layer .layer-label { color: #ef6461; }

  .layer-sub {
    font-family: var(--font-sans);
    font-size: 0.78rem;
    color: var(--text-muted);
    margin-top: 0.15rem;
  }

  .layer-tags {
    font-family: var(--font-mono);
    font-size: 0.7rem;
    color: var(--text-muted);
    margin-top: 0.4rem;
  }

  .layer-arrow {
    font-size: 1.2rem;
    color: var(--text-muted);
    margin: 0.3rem 0;
  }
</style>
