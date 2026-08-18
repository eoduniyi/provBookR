<script lang="ts">
  import { onMount } from 'svelte';
  import { gsap } from 'gsap';

  let sectionEl: HTMLElement;
  let activePortal = $state<number | null>(null);

  /**
   * Image manifest — Cambridge, MA field captures
   * GPS-tagged Pixel 8 photos from April 21 2026,
   * grouped by location cluster.
   */
  const portals = [
    {
      id: 'harvard-yard',
      title: 'Harvard Yard · Johnston Gate',
      coords: '42.3747°N, 71.1183°W',
      time: '10:53 AM',
      phase: 'NeRF — Reanimation',
      phaseColor: '#8b5cf6',
      description:
        'The oldest enclosed yard in American higher education. ' +
        'These brick walls and iron gates have absorbed centuries of light. ' +
        'A NeRF capture here doesn\'t just record geometry — it preserves ' +
        'the volumetric memory of how sunlight falls through elm canopy ' +
        'onto Georgian brick.',
      techNote:
        'Feed landscape + portrait pairs into a Neural Radiance Field pipeline ' +
        'to generate a navigable 3D spatial pocket. When a visitor in LA points ' +
        'their phone at Exposition Park, they see Harvard Yard floating in ' +
        'their environment — not a flat image, but a reanimated volume.',
      images: [
        { src: '/images/harvard-yard-01.jpg', alt: 'Harvard Yard through Johnston Gate, morning light on brick paths' },
        { src: '/images/harvard-yard-02.jpg', alt: 'Johnston Gate ironwork detail, elm shadows on stone' },
      ],
    },
    {
      id: 'cambridge-library',
      title: 'Cambridge Public Library',
      coords: '42.3734°N, 71.1111°W',
      time: '11:11 AM',
      phase: 'Spectroscopy — Vibrational Signal',
      phaseColor: '#f59e0b',
      description:
        'The Cambridge Public Library sits at the intersection of civic ' +
        'architecture and public knowledge — a building designed to hold ' +
        'and transmit information. The materials here — stone, glass, ' +
        'wood — each reflect light at distinct spectral frequencies. ' +
        'This is where the "vibration" in Vibrational Codex becomes literal.',
      techNote:
        'Extract color and light data from these reference photos as spectral ' +
        'data rather than simple RGB. Process through fast sparse spectral ' +
        'kernels to isolate the vibrational signature of each material surface. ' +
        'This data generates the live audio frequencies and visual distortions ' +
        'that stream to the LA installation.',
      images: [
        { src: '/images/cambridge-public-library-01.jpg', alt: 'Cambridge Public Library facade, midday light on stone' },
        { src: '/images/cambridge-public-library-02.jpg', alt: 'Cambridge Public Library architectural detail' },
        { src: '/images/cambridge-public-library-03.jpg', alt: 'Cambridge Public Library entrance, light and shadow' },
      ],
    },
    {
      id: 'mit-chapel',
      title: 'MIT Chapel',
      coords: '42.3582°N, 71.0938°W',
      time: '3:22 PM',
      phase: 'NeRF — Reanimation',
      phaseColor: '#8b5cf6',
      description:
        'Saarinen\'s cylindrical chapel is a container for light — a ' +
        'windowless brick drum whose interior is illuminated entirely by ' +
        'reflections off a surrounding moat. The space is pure controlled ' +
        'resonance. A NeRF capture here preserves not just the geometry ' +
        'but the way light enters indirectly, bouncing off water into brick.',
      techNote:
        'The chapel\'s unique lighting — indirect reflections off water — ' +
        'makes it an ideal NeRF subject. The radiance field captures how ' +
        'light behaves in the volume, not just on surfaces. This 3D asset ' +
        'can be overlaid onto a mirror site in LA, carrying the chapel\'s ' +
        'spatial light signature with it.',
      images: [
        { src: '/images/mit-chapel-01.jpg', alt: 'MIT Chapel exterior, cylindrical brick form in afternoon light' },
        { src: '/images/mit-chapel-02.jpg', alt: 'MIT Chapel detail, brick and light reflections' },
        { src: '/images/mit-chapel-03.jpg', alt: 'MIT Chapel surroundings, water and material surfaces' },
      ],
    },
    {
      id: 'harvard-bridge',
      title: 'Harvard Bridge · The Charles River',
      coords: '42.3577°N, 71.0923°W',
      time: '3:27 PM',
      phase: 'WebXR — Overlay Generation',
      phaseColor: '#ef6461',
      description:
        'The Harvard Bridge — measured in Smoots, connecting MIT to Boston — ' +
        'is the literal threshold between two cities. Standing mid-span, ' +
        'you see both skylines reflected in the Charles. This is the portal ' +
        'metaphor made physical: a structure that exists in two places at once.',
      techNote:
        'Use WebXR to anchor the AR experience at the viewer\'s GPS coordinates. ' +
        'The application pulls the NeRF volumes (Harvard Yard, MIT Chapel) and ' +
        'the spectral signal (Cambridge Library materials) and overlays them ' +
        'onto the live camera feed of the mirror location in Los Angeles. ' +
        'The phone becomes the instrument that makes the invisible connection ' +
        'perceivable.',
      images: [
        { src: '/images/harvard-bridge-01.jpg', alt: 'Harvard Bridge spanning the Charles River, sunset alignment' },
      ],
    },
  ];

  onMount(() => {
    gsap.from(sectionEl, { opacity: 0, y: 20, duration: 0.6, ease: 'power2.out' });
  });

  function togglePortal(index: number) {
    activePortal = activePortal === index ? null : index;
  }
</script>

<section bind:this={sectionEl}>
  <div class="page">
    <p class="chapter-label">Field Notes</p>
    <h2>Cambridge Portals</h2>

    <p>
      Four locations in Cambridge, MA form the source nodes of the
      Vibrational Codex portal network. Each site was captured on April 21,
      2026 — the same day, the same device, the same light — creating a
      temporal thread that binds them into a single computational narrative.
    </p>

    <p>
      Each location maps to a phase of the pipeline: spatial geometry is
      captured (NeRF), material frequencies are extracted (Spectroscopy),
      and the perceptual overlay is generated (WebXR). Together they form a
      complete translation from physical space in Cambridge to augmented
      experience in Los Angeles.
    </p>

    <div class="portal-stack">
      {#each portals as portal, i}
        <button
          class="portal-card"
          class:active={activePortal === i}
          onclick={() => togglePortal(i)}
          style="--phase-color: {portal.phaseColor}"
        >
          <div class="portal-header">
            <div class="portal-title-group">
              <span class="portal-phase">{portal.phase}</span>
              <h3>{portal.title}</h3>
              <span class="portal-meta">{portal.coords} · {portal.time}</span>
            </div>
            <span class="portal-toggle">{activePortal === i ? '−' : '+'}</span>
          </div>

          {#if activePortal === i}
            <div class="portal-body">
              <p class="portal-desc">{portal.description}</p>

              <div class="portal-gallery">
                {#each portal.images as img}
                  <figure class="portal-figure">
                    <img
                      src={img.src}
                      alt={img.alt}
                      loading="lazy"
                      decoding="async"
                    />
                    <figcaption>{img.alt}</figcaption>
                  </figure>
                {/each}
              </div>

              <div class="tech-note">
                <span class="tech-label">Pipeline</span>
                {portal.techNote}
              </div>
            </div>
          {/if}
        </button>
      {/each}
    </div>

    <div class="note">
      The photos are not illustrations. They are raw data — the input to a
      computational pipeline that digitizes space (NeRF), extracts hidden
      frequencies (Spectroscopy), and projects them into a sister city
      (WebXR).
    </div>

    <div class="section-break">· · ·</div>
  </div>
</section>

<style>
  .portal-stack {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin: 2rem 0;
  }

  .portal-card {
    all: unset;
    display: block;
    cursor: pointer;
    background: var(--bg-figure, #fafbfc);
    border: 1px solid var(--border, #e5e7eb);
    border-left: 4px solid var(--phase-color);
    border-radius: 6px;
    padding: 1rem 1.25rem;
    text-align: left;
    transition: border-color 0.2s, box-shadow 0.2s;
    width: 100%;
  }

  .portal-card:hover {
    border-color: var(--phase-color);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }

  .portal-card.active {
    border-color: var(--phase-color);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  }

  .portal-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }

  .portal-title-group {
    flex: 1;
  }

  .portal-phase {
    font-family: var(--font-mono, monospace);
    font-size: 0.7rem;
    color: var(--phase-color);
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  .portal-card h3 {
    font-size: 1rem;
    margin: 0.2rem 0 0.15rem;
    color: var(--text, #1a1a2e);
    line-height: 1.3;
  }

  .portal-meta {
    font-family: var(--font-mono, monospace);
    font-size: 0.68rem;
    color: var(--text-muted, #94a3b8);
  }

  .portal-toggle {
    font-family: var(--font-mono, monospace);
    font-size: 1.2rem;
    color: var(--text-muted, #94a3b8);
    flex-shrink: 0;
    width: 1.5rem;
    text-align: center;
    line-height: 1;
    margin-top: 0.3rem;
  }

  .portal-body {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid var(--border, #e5e7eb);
  }

  .portal-desc {
    font-size: 0.92rem;
    line-height: 1.65;
    margin-bottom: 1rem;
    color: var(--text-secondary, #555);
  }

  .portal-gallery {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 0.75rem;
    margin: 1rem 0;
  }

  .portal-figure {
    margin: 0;
    border-radius: 4px;
    overflow: hidden;
    background: var(--bg, #fff);
    border: 1px solid var(--border, #e5e7eb);
  }

  .portal-figure img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    display: block;
  }

  .portal-figure figcaption {
    font-family: var(--font-sans);
    font-size: 0.7rem;
    color: var(--text-muted, #94a3b8);
    padding: 0.5rem 0.75rem;
    border-top: 1px solid var(--border, #e5e7eb);
    line-height: 1.4;
  }

  .tech-note {
    font-family: var(--font-sans);
    font-size: 0.82rem;
    color: var(--text-secondary, #555);
    background: rgba(0, 0, 0, 0.02);
    border: 1px dashed var(--border, #e5e7eb);
    border-radius: 4px;
    padding: 0.75rem 1rem;
    margin-top: 1rem;
    line-height: 1.55;
  }

  .tech-label {
    font-family: var(--font-mono, monospace);
    font-size: 0.68rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--text-muted, #94a3b8);
    display: block;
    margin-bottom: 0.3rem;
  }

  @media (max-width: 640px) {
    .portal-gallery {
      grid-template-columns: 1fr;
    }

    .portal-figure img {
      height: 180px;
    }
  }
</style>
