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
    <p class="chapter-label">Chapter 5</p>
    <h2>Public Engagement</h2>

    <p>
      The project proposes three modes of public engagement, each designed to
      meet people where they are — in the museum, in a workshop, or on their
      own device.
    </p>

    <div class="mode">
      <div class="mode-number">1</div>
      <div class="mode-body">
        <h3>On-Site Installation</h3>
        <p>
          Visitors interact with the Vibrational Codex prototype at LACMA,
          speaking to a live AI system and perceiving its inference process
          through light, sound, and touch.
        </p>
      </div>
    </div>

    <div class="mode">
      <div class="mode-number">2</div>
      <div class="mode-body">
        <h3>Open Workshops</h3>
        <p>
          Participants build simplified versions of the perceptual mapping
          toolkit, learning to instrument and translate computational
          processes themselves.
        </p>
      </div>
    </div>

    <div class="mode">
      <div class="mode-number">3</div>
      <div class="mode-body">
        <h3>Distributed Platform</h3>
        <p>
          An open-source platform and augmented reality layer extends the
          experience beyond the museum, allowing anyone with a phone to
          overlay computational legibility onto their own environment.
        </p>
      </div>
    </div>

    <div class="note">
      Los Angeles is uniquely positioned for this work. UCLA's computational
      design tradition (including the shape grammar lineage of George Stiny,
      a UCLA graduate), the NASA Jet Propulsion Laboratory, and the NASA
      Quantum AI Lab represent the frontier of the systems this project
      seeks to make legible. The city's community of artists and musicians
      working across sound, light, and interactive media offers a rich
      network of potential collaborators.
    </div>

    <div class="epigraph">
      Vibrational Codex aims to translate the physics of generative
      intelligence into the physics of human sensation. It asks: What does it
      feel like when a machine thinks?
    </div>

    <div class="section-break">· · ·</div>
  </div>
</section>

<style>
  .mode {
    display: flex;
    gap: 1rem;
    margin: 1.5rem 0;
    align-items: flex-start;
  }

  .mode-number {
    flex-shrink: 0;
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    background: var(--accent, #2563eb);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: var(--font-sans);
    font-size: 0.85rem;
    font-weight: 600;
    margin-top: 0.15rem;
  }

  .mode-body h3 {
    font-size: 1rem;
    margin-top: 0;
    margin-bottom: 0.3rem;
  }

  .mode-body p {
    margin-bottom: 0;
    font-size: 0.95rem;
    line-height: 1.65;
  }
</style>
