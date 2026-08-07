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
    <p class="chapter-label">Chapter 6</p>
    <h2>Timeline &amp; Budget</h2>

    <p>
      The project follows a 24-month plan from Fall 2026 through Fall 2028,
      organized into four phases. Each phase builds on the previous, moving
      from core research through integration, refinement, and public
      exhibition.
    </p>

    <div class="phase-flow">
      <div class="phase-card phase-1">
        <div class="phase-header">
          <span class="phase-title">Phase 1: Foundation</span>
          <span class="phase-cost">$11,000</span>
        </div>
        <div class="phase-months">Months 1–6 · Fall 2026 – Spring 2027</div>
        <p class="phase-desc">
          Core engine development and signal mapping research. Build
          Rust-based telemetry runtime, develop initial signal-to-perception
          mapping library, prototype single-channel perceptual output.
        </p>
      </div>

      <div class="phase-card phase-2">
        <div class="phase-header">
          <span class="phase-title">Phase 2: Integration</span>
          <span class="phase-cost">$12,000</span>
        </div>
        <div class="phase-months">Months 7–12 · Spring – Fall 2027</div>
        <p class="phase-desc">
          Multi-sensory integration and physical form development. Integrate
          light, sound, and haptics. Design and fabricate resonant surface.
        </p>
      </div>

      <div class="phase-card phase-3">
        <div class="phase-header">
          <span class="phase-title">Phase 3: Refinement</span>
          <span class="phase-cost">$12,500</span>
        </div>
        <div class="phase-months">Months 13–20 · Fall 2027 – Summer 2028</div>
        <p class="phase-desc">
          Exhibition-grade finishing, workshop development, and toolkit
          publication. Publish open-source Rust toolkit and design pattern
          library.
        </p>
      </div>

      <div class="phase-card phase-4">
        <div class="phase-header">
          <span class="phase-title">Phase 4: Exhibition</span>
          <span class="phase-cost">$10,500</span>
        </div>
        <div class="phase-months">Months 21–24 · Summer – Fall 2028</div>
        <p class="phase-desc">
          LACMA installation, public programs, and project wrap-up. Conduct
          public workshop sessions. Demo Day presentation and final report.
        </p>
      </div>
    </div>

    <div class="total-card">
      <span>Total requested</span>
      <span class="total-amount">$48,500</span>
    </div>

    <div class="section-break">· · ·</div>
  </div>
</section>

<style>
  .phase-flow {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin: 1.5rem 0;
  }

  .phase-card {
    background: var(--bg-figure, #fafbfc);
    border: 1px solid var(--border, #e5e7eb);
    border-radius: 6px;
    padding: 1rem 1.25rem;
    padding-left: 1.75rem;
    position: relative;
  }

  .phase-card::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    border-radius: 6px 0 0 6px;
  }

  .phase-1::before { background: #f59e0b; }
  .phase-2::before { background: #2563eb; }
  .phase-3::before { background: #8b5cf6; }
  .phase-4::before { background: #ef4444; }

  .phase-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 0.15rem;
  }

  .phase-title {
    font-family: var(--font-sans);
    font-weight: 600;
    font-size: 0.9rem;
  }

  .phase-cost {
    font-family: var(--font-mono);
    font-size: 0.82rem;
    color: var(--accent, #2563eb);
  }

  .phase-months {
    font-family: var(--font-sans);
    font-size: 0.72rem;
    color: var(--text-muted, #94a3b8);
    margin-bottom: 0.3rem;
  }

  .phase-desc {
    font-size: 0.88rem;
    line-height: 1.55;
    margin-bottom: 0;
    color: var(--text-secondary, #555);
  }

  .total-card {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: var(--bg-figure, #fafbfc);
    border: 2px solid var(--accent, #2563eb);
    border-radius: 6px;
    padding: 0.8rem 1.25rem;
    margin-top: 1rem;
    font-family: var(--font-sans);
    font-weight: 600;
    font-size: 0.95rem;
  }

  .total-amount {
    font-family: var(--font-mono);
    font-size: 1.1rem;
    color: var(--accent, #2563eb);
  }
</style>
