<script lang="ts">
  import { animationState } from '../animationState.svelte';
  import Icon from './Icon.svelte';

  const presets = [
    { id: 'off', label: 'Off', icon: 'circle-slash' },
    { id: 'watercolor', label: 'Watercolor', icon: 'droplet' },
    { id: 'clouds', label: 'Clouds', icon: 'cloud' },
    { id: 'fire', label: 'Fire', icon: 'flame' },
    { id: 'particles', label: 'Particles', icon: 'atom' },
    { id: 'streams', label: 'Streams', icon: 'git-branch' },
    { id: 'rainbow', label: 'Rainbow', icon: 'rainbow' }
  ];

  const palettes = [
    { id: 'auto', label: 'Auto Theme' },
    { id: 'warm', label: 'Warm' },
    { id: 'cool', label: 'Cool' },
    { id: 'eink', label: 'E-Ink Mono' }
  ];
</script>

{#if animationState.isOpen}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div class="settings-backdrop" onclick={() => animationState.isOpen = false}></div>
  <div class="settings-popover">
    
    <div class="settings-section">
      <div class="settings-row">
        <span class="row-label">Animation Preset</span>
      </div>
      <div class="preset-grid">
        {#each presets as p}
          <button 
            class="preset-card" 
            class:on={animationState.preset === p.id} 
            onclick={() => animationState.preset = p.id as any}
          >
            <Icon name={p.icon} size={20} strokeWidth={animationState.preset === p.id ? 2.5 : 1.5} />
            <span class="preset-label">{p.label}</span>
          </button>
        {/each}
      </div>
    </div>

    {#if animationState.preset !== 'off'}
      <div class="settings-section">
        <div class="settings-row">
          <span class="row-label">Palette</span>
          <div class="seg-bar">
            {#each palettes as p}
              <button class="seg" class:on={animationState.palette === p.id} onclick={() => animationState.palette = p.id as any}>{p.label}</button>
            {/each}
          </div>
        </div>

        <div class="settings-row">
          <span class="row-label">Intensity</span>
          <div class="slider-pair">
            <input type="range" min="0.1" max="1.0" step="0.1" bind:value={animationState.intensity} class="custom-range" />
            <span class="slider-val">{Math.round(animationState.intensity * 100)}%</span>
          </div>
        </div>

        <div class="settings-row">
          <span class="row-label">Flow Speed</span>
          <div class="slider-pair">
            <input type="range" min="0.2" max="2.0" step="0.1" bind:value={animationState.speed} class="custom-range" />
            <span class="slider-val">{animationState.speed.toFixed(1)}x</span>
          </div>
        </div>
      </div>

      <div class="settings-section">
        <div class="settings-row">
          <span class="row-label">Physics & Dynamics</span>
        </div>
        <div class="settings-row">
          <span class="row-label" style="text-transform: none; font-weight: 500;">Text Collision Forces</span>
          <div class="seg-bar">
            <button class="seg" class:on={!animationState.textInteraction} onclick={() => animationState.textInteraction = false}>Ignore</button>
            <button class="seg" class:on={animationState.textInteraction} onclick={() => animationState.textInteraction = true}>Deflect</button>
          </div>
        </div>
        <div class="settings-row">
          <span class="row-label" style="text-transform: none; font-weight: 500;">Pointer Disturbances</span>
          <div class="seg-bar">
            <button class="seg" class:on={!animationState.pointerInteraction} onclick={() => animationState.pointerInteraction = false}>Off</button>
            <button class="seg" class:on={animationState.pointerInteraction} onclick={() => animationState.pointerInteraction = true}>Interactive</button>
          </div>
        </div>
      </div>
    {/if}
  </div>
{/if}

<style>
  .settings-backdrop {
    position: fixed;
    inset: 0;
    z-index: 998;
  }

  .settings-popover {
    position: fixed;
    bottom: 5.5rem;
    left: 50%;
    transform: translateX(-50%);
    z-index: 999;
    width: 440px;
    background: var(--glass-bg, rgba(255, 255, 255, 0.82));
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    border: 1px solid var(--glass-border, rgba(255, 255, 255, 0.9));
    border-radius: 20px;
    padding: 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    box-shadow: var(--glass-shadow);
    animation: slideUp 0.28s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  @keyframes slideUp {
    from { opacity: 0; transform: translate(-50%, 12px) scale(0.97); }
    to   { opacity: 1; transform: translate(-50%, 0) scale(1); }
  }

  .settings-section {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .settings-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    min-height: 32px;
  }

  .row-label {
    font-family: var(--font-sans);
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--text-muted, #94a3b8);
    white-space: nowrap;
    flex-shrink: 0;
  }

  /* ── Preset Grid ── */
  .preset-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0.5rem;
  }

  .preset-card {
    all: unset;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 1rem 0.5rem;
    background: var(--pill-bg, rgba(0, 0, 0, 0.04));
    border-radius: 12px;
    color: var(--text-secondary, #4a4a5a);
    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    border: 1px solid transparent;
  }

  .preset-card:hover {
    background: var(--glass-bg-hover, rgba(255, 255, 255, 0.5));
    color: var(--text, #1a1a24);
  }

  .preset-card.on {
    background: var(--pill-badge-bg, #1a1a24);
    color: var(--pill-badge-text, #ffffff);
    border: 1px solid var(--card-border-active, transparent);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }

  .preset-label {
    font-family: var(--font-sans);
    font-size: 0.7rem;
    font-weight: 500;
  }
  .preset-card.on .preset-label {
    font-weight: 600;
  }

  /* ── Segmented bar ── */
  .seg-bar {
    display: flex;
    background: var(--pill-bg, rgba(0, 0, 0, 0.04));
    border-radius: 8px;
    padding: 3px;
    gap: 2px;
    flex: 1; /* Stretch to fill remaining space */
  }

  .seg {
    all: unset;
    cursor: pointer;
    flex: 1; /* Equal width segments */
    font-family: var(--font-sans);
    font-size: 0.7rem;
    font-weight: 500;
    color: var(--text-secondary, #4a4a5a);
    padding: 0.4rem 0.2rem;
    border-radius: 6px;
    white-space: nowrap;
    transition: all 0.18s cubic-bezier(0.16, 1, 0.3, 1);
    text-align: center;
  }
  .seg:hover {
    color: var(--text, #1a1a24);
    background: var(--glass-bg-hover, rgba(255, 255, 255, 0.5));
  }
  .seg.on {
    background: var(--pill-badge-bg, #1a1a24);
    color: var(--pill-badge-text, #ffffff);
    border: 1px solid var(--card-border-active, transparent);
    font-weight: 600;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
  }

  /* ── Slider row ── */
  .slider-pair {
    display: flex;
    align-items: center;
    gap: 0.8rem;
    flex: 1;
  }
  .slider-val {
    font-family: var(--font-mono, monospace);
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--text, #1a1a24);
    min-width: 2.5rem;
    text-align: right;
  }

  .custom-range {
    -webkit-appearance: none;
    appearance: none;
    flex: 1;
    height: 4px;
    border-radius: 2px;
    background: var(--pill-bg, rgba(0, 0, 0, 0.1));
    outline: none;
  }
  .custom-range::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: var(--pill-badge-bg, #1a1a24);
    cursor: pointer;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
    transition: transform 0.1s;
  }
  .custom-range::-moz-range-thumb {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: var(--pill-badge-bg, #1a1a24);
    border: none;
    cursor: pointer;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
    transition: transform 0.1s;
  }
  .custom-range::-webkit-slider-thumb:hover,
  .custom-range::-moz-range-thumb:hover {
    transform: scale(1.15);
  }
</style>
