<script lang="ts">
  import { themeState } from '../themeState.svelte';
  import { activeScenarioState, activeScriptState, currentScenarioMetadata } from '../state.svelte';
  import type { ScenarioId } from '../data/scenarios';
  
  const fonts = [
    { id: 'font-system-mono', label: 'System Mono' },
    { id: 'font-fira-code', label: 'Fira Code' },
    { id: 'font-jetbrains', label: 'JetBrains' },
    { id: 'font-sans-code', label: 'Sans-Serif' }
  ];

  const skins = [
    { id: 'theme-eink-light', label: 'Light E-Ink' },
    { id: 'theme-eink-dark', label: 'Dark Slate' },
    { id: 'theme-high-contrast', label: 'High Contrast' }
  ];

  const lineHeights = [
    { label: 'Tight', value: 1.5 },
    { label: 'Normal', value: 1.78 },
    { label: 'Loose', value: 2.1 }
  ];

  const curlModes = [
    { label: 'Off', value: 'off' },
    { label: 'Page Curl', value: 'curl' },
    { label: '3D Ripple', value: 'ripple' }
  ];


</script>

{#if themeState.isOpen}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div class="settings-backdrop" onclick={() => themeState.isOpen = false}></div>
  <div class="settings-popover">
    
    <div class="settings-section">

      
      <div class="settings-row">
        <span class="row-label">Theme</span>
        <div class="seg-bar">
          {#each skins as s}
            <button class="seg" class:on={themeState.skin === s.id} onclick={() => themeState.skin = s.id}>{s.label}</button>
          {/each}
        </div>
      </div>
    </div>

    <div class="settings-section">
      <div class="settings-row">
        <span class="row-label">Code Font</span>
        <div class="seg-bar">
          {#each fonts as f}
            <button class="seg" class:on={themeState.codeFont === f.id} onclick={() => themeState.codeFont = f.id}>{f.label}</button>
          {/each}
        </div>
      </div>

      <div class="settings-row">
        <span class="row-label">Reading Font</span>
        <div class="seg-bar">
          <button class="seg" class:on={themeState.fontFamily === 'serif'} onclick={() => themeState.fontFamily = 'serif'}>Classic Serif</button>
          <button class="seg" class:on={themeState.fontFamily === 'sans'} onclick={() => themeState.fontFamily = 'sans'}>Modern Sans</button>
        </div>
      </div>

      <div class="settings-row">
        <span class="row-label">Font Size</span>
        <div class="stepper-container">
          <div class="stepper">
            <button class="step-btn" onclick={() => themeState.fontSize = Math.max(12, themeState.fontSize - 2)}>−</button>
            <span class="step-val">{themeState.fontSize}px</span>
            <button class="step-btn" onclick={() => themeState.fontSize = Math.min(24, themeState.fontSize + 2)}>+</button>
          </div>
        </div>
      </div>
    </div>

    <div class="settings-section">
      <div class="settings-row">
        <span class="row-label">Line Spacing</span>
        <div class="seg-bar">
          {#each lineHeights as lh}
            <button class="seg" class:on={themeState.lineHeight === lh.value} onclick={() => themeState.lineHeight = lh.value}>{lh.label}</button>
          {/each}
        </div>
      </div>

      <div class="settings-row">
        <span class="row-label">Alignment</span>
        <div class="seg-bar">
          <button class="seg" class:on={!themeState.justified} onclick={() => themeState.justified = false}>Left Align</button>
          <button class="seg" class:on={themeState.justified} onclick={() => themeState.justified = true}>Justified</button>
        </div>
      </div>
    </div>

    <div class="settings-section">
      <div class="settings-row">
        <span class="row-label">Page Turn</span>
        <div class="seg-bar">
          {#each curlModes as m}
            <button class="seg" class:on={m.value === 'off' ? !themeState.curlEnabled : (themeState.curlEnabled && themeState.curlMode === m.value)} 
                    onclick={() => { 
                      if (m.value === 'off') {
                        themeState.curlEnabled = false;
                      } else {
                        themeState.curlEnabled = true; 
                        themeState.curlMode = m.value as 'curl' | 'ripple';
                      }
                    }}>{m.label}</button>
          {/each}
        </div>
      </div>

      {#if themeState.curlEnabled}
        <div class="settings-row">
          <span class="row-label">Radius</span>
          <div class="slider-pair">
            <input type="range" min="0.04" max="0.2" step="0.02" bind:value={themeState.curlRadius} class="custom-range" />
            <span class="slider-val">{themeState.curlRadius}</span>
          </div>
        </div>
        <div class="settings-row">
          <span class="row-label">Speed</span>
          <div class="slider-pair">
            <input type="range" min="0.3" max="2.0" step="0.1" bind:value={themeState.curlSpeed} class="custom-range" />
            <span class="slider-val">{themeState.curlSpeed}s</span>
          </div>
        </div>
      {/if}
    </div>
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
    width: 440px; /* Narrower width, perfect for vertical list */
    background: var(--popover-bg, rgba(253, 252, 249, 0.96));
    backdrop-filter: blur(28px);
    -webkit-backdrop-filter: blur(28px);
    border: 1px solid var(--popover-border, rgba(0, 0, 0, 0.12));
    border-radius: 20px;
    padding: 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    box-shadow: var(--popover-shadow, 0 20px 48px -8px rgba(0, 0, 0, 0.2));
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

  /* ── Stepper ── */
  .stepper-container {
    flex: 1;
    display: flex;
    justify-content: flex-end;
  }
  .stepper {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: var(--pill-bg, rgba(0, 0, 0, 0.04));
    border-radius: 8px;
    padding: 4px;
  }
  .step-btn {
    all: unset;
    cursor: pointer;
    width: 28px;
    height: 28px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-secondary, #4a4a5a);
    transition: background 0.15s;
  }
  .step-btn:hover {
    background: var(--glass-bg-hover, rgba(0, 0, 0, 0.06));
    color: var(--text);
  }
  .step-val {
    font-family: var(--font-mono, monospace);
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--text, #1a1a24);
    min-width: 3rem;
    text-align: center;
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
