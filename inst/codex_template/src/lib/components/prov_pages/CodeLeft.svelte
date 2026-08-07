<script lang="ts">
  import { activeScriptState, currentScriptMeta, currentScenarioMetadata } from '../../state.svelte';
  import Icon from '../Icon.svelte';

  // Optional active prop for animations
  let { active = true } = $props<{ active?: boolean }>();

  const categories = ['All', 'Documents', 'Everyday Math', 'Data & Stats'] as const;
  let activeCat = $state<string>('All');

  const scripts = $derived(Object.values(currentScenarioMetadata()));

  const filteredScripts = $derived.by(() => {
    if (activeCat === 'All') return scripts;
    return scripts.filter(s => s.category === activeCat);
  });

  const selectedMeta = $derived.by(() => {
    return currentScenarioMetadata()[activeScriptState.currentId] || scripts[0];
  });
</script>

<div class="code-left-page">
  <p class="chapter-label">Section 2</p>
  <h2>Source Code Breakdown</h2>
  <p class="section-desc">
    Select a script to inspect its goal, variables created, operations executed, and output artifact.
  </p>

  <!-- Category Selector Pills -->
  <div class="cat-pill-bar">
    {#each categories as cat}
      <button 
        class="cat-pill" 
        class:active={activeCat === cat}
        onclick={() => activeCat = cat}
      >
        {cat}
      </button>
    {/each}
  </div>

  <!-- Script Selector Pills -->
  <div class="script-pill-grid">
    {#each filteredScripts as sc}
      <button 
        class="script-select-pill" 
        class:active={activeScriptState.currentId === sc.id}
        onclick={() => activeScriptState.currentId = sc.id}
      >
        <Icon name={sc.icon} size={14} />
        <span class="sc-name">{sc.name}</span>
      </button>
    {/each}
  </div>

  <!-- Active Script Breakdown Card (Liquid Glass Bubble) -->
  {#if selectedMeta}
    <div class="glass-breakdown-card">
      <div class="breakdown-header">
        <Icon name={selectedMeta.icon} size={16} />
        <span class="bd-title">{selectedMeta.name}</span>
        <span class="bd-cat">{selectedMeta.category}</span>
      </div>

      <p class="bd-goal">
        <span style="display:inline-flex; align-items:center; gap:4px; font-weight:600;"><Icon name="target" size={14} /> Goal:</span> {selectedMeta.goal}
      </p>

      <div class="bd-section">
        <span class="bd-label" style="display:inline-flex; align-items:center; gap:4px;"><Icon name="box" size={14} /> Variables Created ({selectedMeta.variables.length}):</span>
        <div class="pill-wrap">
          {#each selectedMeta.variables as v}
            <span class="var-pill"><code>{v}</code></span>
          {/each}
        </div>
      </div>

      <div class="bd-section">
        <span class="bd-label" style="display:inline-flex; align-items:center; gap:4px;"><Icon name="activity" size={14} /> Key Operations:</span>
        <div class="pill-wrap">
          {#each selectedMeta.operations as op}
            <span class="op-pill">{op}</span>
          {/each}
        </div>
      </div>

      <div class="bd-section">
        <span class="bd-label" style="display:inline-flex; align-items:center; gap:4px;"><Icon name="file-output" size={14} /> Output Artifact:</span>
        <span class="artifact-pill"><code>{selectedMeta.outputFile}</code></span>
      </div>
    </div>
  {/if}
</div>

<style>
  .code-left-page {
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: 100%;
  }
  .code-left-page h2 {
    margin-top: 0.2rem;
    margin-bottom: 0.2rem;
  }
  .section-desc {
    font-size: 0.84rem;
    color: var(--text-secondary, #4a4a5a);
    margin-bottom: 0.8rem;
  }

  /* Category Pills Bar */
  .cat-pill-bar {
    display: flex;
    gap: 0.4rem;
    margin-bottom: 0.6rem;
  }
  .cat-pill {
    all: unset;
    cursor: pointer;
    padding: 0.25rem 0.75rem;
    background: rgba(255, 255, 255, 0.5);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(0, 0, 0, 0.05);
    border-radius: 9999px;
    font-family: var(--font-sans);
    font-size: 0.68rem;
    color: var(--text-muted, #8e8e9e);
    transition: all 0.2s;
  }
  .cat-pill:hover {
    color: var(--text, #1a1a24);
    background: rgba(255, 255, 255, 0.8);
  }
  .cat-pill.active {
    background: #ffffff;
    border-color: rgba(0, 0, 0, 0.12);
    color: var(--text, #1a1a24);
    font-weight: 600;
  }

  /* Script Selector Grid */
  .script-pill-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 0.45rem;
    margin-bottom: 1rem;
  }

  .script-select-pill {
    all: unset;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.45rem 0.85rem;
    background: rgba(255, 255, 255, 0.65);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    border: 1px solid rgba(255, 255, 255, 0.85);
    border-radius: 9999px;
    font-family: var(--font-mono, monospace);
    font-size: 0.74rem;
    color: var(--text-secondary, #4a4a5a);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.02);
    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .script-select-pill:hover {
    transform: translateY(-1px);
    background: rgba(255, 255, 255, 0.85);
    color: var(--text, #1a1a24);
  }

  .script-select-pill.active {
    background: #ffffff;
    border-color: rgba(0, 0, 0, 0.15);
    color: var(--text, #1a1a24);
    font-weight: 600;
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.05);
  }

  /* Breakdown Card (Liquid Glass Bubble) */
  .glass-breakdown-card {
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid rgba(255, 255, 255, 0.9);
    border-radius: 20px;
    padding: 1rem 1.3rem;
    display: flex;
    flex-direction: column;
    gap: 0.65rem;
    box-shadow: 0 8px 32px -4px rgba(0, 0, 0, 0.04), inset 0 1px 1px rgba(255, 255, 255, 0.9);
  }

  .breakdown-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    padding-bottom: 0.5rem;
  }

  .bd-title {
    font-family: var(--font-mono, monospace);
    font-size: 0.82rem;
    font-weight: 700;
    color: var(--text, #1a1a24);
  }

  .bd-cat {
    margin-left: auto;
    font-family: var(--font-sans);
    font-size: 0.62rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    padding: 0.15rem 0.5rem;
    background: rgba(0, 0, 0, 0.04);
    border-radius: 9999px;
    color: var(--text-muted, #8e8e9e);
  }

  .bd-goal {
    font-family: var(--font-sans);
    font-size: 0.78rem;
    color: var(--text-secondary, #4a4a5a);
    margin: 0;
    line-height: 1.45;
  }

  .bd-section {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .bd-label {
    font-family: var(--font-sans);
    font-size: 0.68rem;
    font-weight: 600;
    color: var(--text-muted, #8e8e9e);
  }

  .pill-wrap {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
  }

  .var-pill {
    font-family: var(--font-mono, monospace);
    font-size: 0.72rem;
    padding: 0.15rem 0.55rem;
    background: #ffffff;
    border: 1px solid rgba(0, 0, 0, 0.08);
    border-radius: 9999px;
    color: var(--text, #1a1a24);
  }

  .op-pill {
    font-family: var(--font-sans);
    font-size: 0.7rem;
    padding: 0.15rem 0.55rem;
    background: rgba(0, 0, 0, 0.03);
    border-radius: 9999px;
    color: var(--text-secondary, #4a4a5a);
  }

  .artifact-pill {
    font-family: var(--font-mono, monospace);
    font-size: 0.75rem;
    font-weight: 600;
    padding: 0.2rem 0.65rem;
    background: #ffffff;
    border: 1px solid rgba(0, 0, 0, 0.12);
    border-radius: 9999px;
    color: var(--text, #1a1a24);
    display: inline-block;
  }
</style>
