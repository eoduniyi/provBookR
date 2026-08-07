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
    <p class="chapter-label">Chapter 3</p>
    <h2>The Physical Installation</h2>

    <p>
      The physical installation at LACMA anchors the experience in a specific
      place, but the toolkit is designed to run everywhere. The core
      applications work on any phone or laptop with a speaker and a screen.
      The augmented reality layer overlays perceptual translations onto
      physical landmarks, turning any location into a site of computational
      legibility.
    </p>

    <p>
      What makes the LACMA installation special is not specialized hardware —
      it is the design of the space for collective presence. Transducers,
      light, and sound respond to a live AI system processing visitors'
      spoken input. The embedded systems powering it (edge devices, phones,
      or cloud endpoints) are interchangeable. The application layer is what
      matters.
    </p>

    <div class="note">
      When access to the technology is potentially everywhere, what makes a
      physical venue matter? The answer is collective presence. The
      installation creates a shared perceptual event — a room full of people
      feeling the same "machine think" — that cannot be replicated alone at
      home. The hardware is flexible; the community is specific.
    </div>

    <h3>Three Artifacts</h3>

    <ol class="artifact-list">
      <li>
        <strong>Open-source toolkit and applications</strong> for AI telemetry
        capture and perceptual mapping, designed to run on mobile and desktop
      </li>
      <li>
        <strong>Design pattern library</strong> documenting the
        signal-to-perception mappings
      </li>
      <li>
        <strong>Physical installation at LACMA</strong>, designed as a
        community-specific anchor for a globally distributed platform
      </li>
    </ol>

    <div class="section-break">· · ·</div>
  </div>
</section>

<style>
  .artifact-list {
    padding-left: 1.5rem;
    margin: 1.2rem 0 1.5rem;
  }

  .artifact-list li {
    margin-bottom: 0.8rem;
    line-height: 1.65;
  }
</style>
