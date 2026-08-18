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
    <p class="chapter-label">Chapter 4</p>
    <h2>Theoretical Grounding</h2>

    <p>
      Vibrational Codex is grounded in a convergence of complexity science,
      computational neuroscience, and AI interpretability research.
    </p>

    <div class="theory-card">
      <h3>The Free Energy Principle</h3>
      <p>
        Friston (2010) frames both brains and AI systems as prediction engines
        minimizing variational free energy. When these two inferential systems
        are coupled through a narrow perceptual channel, the result is a joint
        distribution whose emergent properties belong to neither system alone.
        Vibrational Codex widens that channel.
      </p>
    </div>

    <div class="theory-card">
      <h3>Rate-Distortion Theory</h3>
      <p>
        Tishby et al. (1999) formalize how to compress high-entropy
        computational processes into low-bandwidth perceptual signals while
        preserving the information humans need to regulate their relationship
        with the AI. The expression layer is designed as a rate-distortion-optimal
        encoder.
      </p>
    </div>

    <div class="theory-card">
      <h3>Human-AI Feedback Loops</h3>
      <p>
        Glickman &amp; Sharot (2025) demonstrate empirically that biases
        amplify through repeated human-AI interaction, more so than in
        human-human interaction. Making the AI's internal process perceptible
        is a form of precision calibration.
      </p>
    </div>

    <div class="theory-card">
      <h3>Shape Grammars</h3>
      <p>
        Stiny (1980) formalized how spatial structures can be described,
        composed, and transformed through rule-based systems. Shape grammars
        provide a computational design language for the expression layer —
        a way to define how perceptual forms are generated from computational
        signals, ensuring the translations are structurally coherent rather
        than arbitrary.
      </p>
    </div>

    <div class="section-break">· · ·</div>
  </div>
</section>

<style>
  .theory-card {
    border: 1px solid var(--border, #e5e7eb);
    border-radius: 6px;
    padding: 1rem 1.25rem;
    margin: 1rem 0;
    background: var(--bg-figure, #fafbfc);
  }

  .theory-card h3 {
    font-size: 1rem;
    margin-top: 0;
    margin-bottom: 0.4rem;
    color: var(--accent, #2563eb);
  }

  .theory-card p {
    margin-bottom: 0;
    font-size: 0.95rem;
    line-height: 1.65;
  }
</style>
