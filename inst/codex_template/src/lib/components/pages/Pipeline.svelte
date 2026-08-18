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
    <p class="chapter-label">Field Notes (cont.)</p>
    <h2>The Portal Pipeline</h2>

    <p>
      The four Cambridge locations aren't just photo opportunities — they are
      the input stages of a computational pipeline that connects physical
      space across 2,600 miles.
    </p>

    <div class="pipeline">
      <div class="pipeline-stage" style="--stage-color: #8b5cf6">
        <div class="stage-icon">◈</div>
        <div class="stage-content">
          <h3>1. NeRF — Reanimation</h3>
          <p class="stage-location">Harvard Yard · MIT Chapel</p>
          <p>
            2D landscape and portrait shots are fed into a Neural Radiance
            Field pipeline, generating navigable, volumetric 3D assets.
            The result isn't a photograph — it's a spatial pocket that
            preserves how light moves through each space.
          </p>
          <div class="stage-io">
            <span class="io-label">In</span> GPS-tagged JPEGs + video pans
            <span class="io-arrow">→</span>
            <span class="io-label">Out</span> Navigable 3D volumes
          </div>
        </div>
      </div>

      <div class="pipeline-connector">
        <div class="connector-line"></div>
        <span class="connector-label">spatial geometry feeds into</span>
      </div>

      <div class="pipeline-stage" style="--stage-color: #f59e0b">
        <div class="stage-icon">∿</div>
        <div class="stage-content">
          <h3>2. Spectroscopy — Vibrational Signal</h3>
          <p class="stage-location">Cambridge Public Library</p>
          <p>
            Color and light data from reference photos are processed as
            spectral data. Fast sparse spectral kernels isolate the
            vibrational signature of each material — stone, glass,
            wood — producing frequencies that can be heard and felt.
          </p>
          <div class="stage-io">
            <span class="io-label">In</span> Spectral pixel data
            <span class="io-arrow">→</span>
            <span class="io-label">Out</span> Audio frequencies + visual distortions
          </div>
        </div>
      </div>

      <div class="pipeline-connector">
        <div class="connector-line"></div>
        <span class="connector-label">vibrational signal feeds into</span>
      </div>

      <div class="pipeline-stage" style="--stage-color: #ef6461">
        <div class="stage-icon">◉</div>
        <div class="stage-content">
          <h3>3. WebXR — Overlay Generation</h3>
          <p class="stage-location">Harvard Bridge · The Charles River</p>
          <p>
            WebXR anchors the AR experience using GPS coordinates and the
            live camera feed. The NeRF volumes and spectral signal are
            composited and overlaid onto the mirror location in Los Angeles.
            The phone becomes the lens that makes the portal perceivable.
          </p>
          <div class="stage-io">
            <span class="io-label">In</span> 3D volumes + spectral signal + GPS
            <span class="io-arrow">→</span>
            <span class="io-label">Out</span> Augmented reality overlay
          </div>
        </div>
      </div>
    </div>

    <div class="mirror-card">
      <div class="mirror-header">
        <span class="mirror-label">Mirror Sites</span>
      </div>
      <div class="mirror-body">
        <div class="mirror-site">
          <span class="mirror-city">Cambridge, MA</span>
          <span class="mirror-detail">Source — Harvard Yard, Library, MIT Chapel, Harvard Bridge</span>
        </div>
        <div class="mirror-arrow">⟷</div>
        <div class="mirror-site">
          <span class="mirror-city">Los Angeles, CA</span>
          <span class="mirror-detail">Destination — LACMA, Exposition Park</span>
        </div>
      </div>
    </div>

    <p>
      The video capture from the bridge (included in the field data) provides
      the motion parallax needed for NeRF reconstruction of the river
      crossing itself — the liminal space between the two cities that
      becomes the portal's threshold.
    </p>

    <div class="section-break">· · ·</div>
  </div>
</section>

<style>
  .pipeline {
    display: flex;
    flex-direction: column;
    gap: 0;
    margin: 2rem 0;
  }

  .pipeline-stage {
    display: flex;
    gap: 1rem;
    padding: 1rem 1.25rem;
    background: var(--bg-figure, #fafbfc);
    border: 1px solid var(--border, #e5e7eb);
    border-left: 4px solid var(--stage-color);
    border-radius: 6px;
  }

  .stage-icon {
    flex-shrink: 0;
    width: 2rem;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    color: var(--stage-color);
    margin-top: 0.1rem;
  }

  .stage-content {
    flex: 1;
  }

  .stage-content h3 {
    font-size: 0.95rem;
    margin: 0 0 0.1rem;
    color: var(--stage-color);
  }

  .stage-location {
    font-family: var(--font-mono, monospace);
    font-size: 0.68rem;
    color: var(--text-muted, #94a3b8);
    margin-bottom: 0.5rem !important;
  }

  .stage-content p {
    font-size: 0.88rem;
    line-height: 1.55;
    margin-bottom: 0.5rem;
    color: var(--text-secondary, #555);
  }

  .stage-io {
    font-family: var(--font-mono, monospace);
    font-size: 0.7rem;
    color: var(--text-muted, #94a3b8);
    padding: 0.4rem 0.6rem;
    background: rgba(0, 0, 0, 0.02);
    border-radius: 3px;
    margin-top: 0.3rem;
  }

  .io-label {
    font-weight: 600;
    color: var(--text-secondary, #555);
  }

  .io-arrow {
    margin: 0 0.3rem;
    color: var(--accent, #2563eb);
  }

  .pipeline-connector {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.3rem 0 0.3rem 2.5rem;
  }

  .connector-line {
    width: 2px;
    height: 1.2rem;
    background: var(--border, #e5e7eb);
  }

  .connector-label {
    font-family: var(--font-sans);
    font-size: 0.68rem;
    color: var(--text-muted, #94a3b8);
    font-style: italic;
  }

  .mirror-card {
    border: 2px solid var(--accent, #2563eb);
    border-radius: 6px;
    overflow: hidden;
    margin: 2rem 0;
  }

  .mirror-header {
    background: var(--accent, #2563eb);
    padding: 0.4rem 1rem;
  }

  .mirror-label {
    font-family: var(--font-sans);
    font-size: 0.72rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #fff;
  }

  .mirror-body {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1.5rem;
    padding: 1rem 1.25rem;
    background: var(--bg-figure, #fafbfc);
  }

  .mirror-site {
    text-align: center;
  }

  .mirror-city {
    display: block;
    font-family: var(--font-sans);
    font-weight: 600;
    font-size: 0.9rem;
    color: var(--text, #1a1a2e);
  }

  .mirror-detail {
    display: block;
    font-family: var(--font-mono, monospace);
    font-size: 0.65rem;
    color: var(--text-muted, #94a3b8);
    margin-top: 0.15rem;
  }

  .mirror-arrow {
    font-size: 1.4rem;
    color: var(--accent, #2563eb);
    flex-shrink: 0;
  }

  @media (max-width: 640px) {
    .mirror-body {
      flex-direction: column;
      gap: 0.5rem;
    }

    .mirror-arrow {
      transform: rotate(90deg);
    }
  }
</style>
