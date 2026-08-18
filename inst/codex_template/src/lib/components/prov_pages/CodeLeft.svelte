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

      <div class="bd-goal-row">
        <span class="bd-goal-label">
          <Icon name="target" size={13} />
          <span>Goal:</span>
        </span>
        <span class="bd-goal-text">{selectedMeta.goal}</span>
      </div>

      <div class="bd-section">
        <span class="bd-label"><Icon name="box" size={13} /> Variables Created ({selectedMeta.variables.length}):</span>
        <div class="pill-wrap">
          {#each selectedMeta.variables as v}
            <span class="var-pill"><code>{v}</code></span>
          {/each}
        </div>
      </div>

      <div class="bd-section">
        <span class="bd-label"><Icon name="activity" size={13} /> Key Operations:</span>
        <div class="pill-wrap">
          {#each selectedMeta.operations as op}
            <span class="op-pill">{op}</span>
          {/each}
        </div>
      </div>

      <div class="bd-section">
        <span class="bd-label"><Icon name="file-output" size={13} /> Output Artifact:</span>
        <span class="artifact-pill"><code>{selectedMeta.outputFile}</code></span>
      </div>
    </div>
  {/if}
</div>

<style>
  .code-left-page {
    display: flex;
    flex-direction: column;
  }
  .code-left-page h2 {
    margin-top: 0.2rem;
    margin-bottom: 0.2rem;
    color: var(--text);
  }
  .section-desc {
    font-size: 0.78rem;
    color: var(--text-secondary);
    margin-bottom: 0.4rem;
  }

  /* Category Pills Bar */
  .cat-pill-bar {
    display: flex;
    gap: 0.3rem;
    margin-bottom: 0.35rem;
  }
  .cat-pill {
    all: unset;
    cursor: pointer;
    padding: 0.18rem 0.6rem;
    background: var(--pill-bg);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid var(--border);
    border-radius: 9999px;
    font-family: var(--font-sans);
    font-size: 0.64rem;
    color: var(--text-muted);
    transition: all 0.2s;
  }
  .cat-pill:hover {
    color: var(--text);
    background: var(--glass-bg-hover);
  }
  .cat-pill.active {
    background: var(--pill-badge-bg, #1a1a24);
    border-color: var(--card-border-active, #1a1a24);
    color: var(--pill-badge-text, #ffffff);
    font-weight: 600;
  }

  /* Script Selector Grid */
  .script-pill-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
    margin-bottom: 0.6rem;
  }

  .script-select-pill {
    all: unset;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.3rem 0.65rem;
    background: var(--glass-bg);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    border: 1px solid var(--glass-border);
    border-radius: 9999px;
    font-family: var(--font-mono, monospace);
    font-size: 0.7rem;
    color: var(--text-secondary);
    box-shadow: var(--glass-shadow);
    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .script-select-pill:hover {
    transform: translateY(-1px);
    background: var(--glass-bg-hover);
    color: var(--text);
  }

  .script-select-pill.active {
    background: var(--pill-badge-bg, #1a1a24);
    border-color: var(--card-border-active, #1a1a24);
    color: var(--pill-badge-text, #ffffff);
    font-weight: 600;
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15);
  }

  /* Breakdown Card (Liquid Glass Bubble) */
  .glass-breakdown-card {
    background: var(--glass-bg);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid var(--glass-border);
    border-radius: 16px;
    padding: 0.75rem 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.45rem;
    box-shadow: var(--glass-shadow);
  }

  .breakdown-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    border-bottom: 1px solid var(--border);
    padding-bottom: 0.5rem;
    color: var(--text);
  }

  .bd-title {
    font-family: var(--font-mono, monospace);
    font-size: 0.82rem;
    font-weight: 700;
    color: var(--text);
  }

  .bd-cat {
    margin-left: auto;
    font-family: var(--font-sans);
    font-size: 0.62rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    padding: 0.15rem 0.5rem;
    background: var(--pill-bg);
    border-radius: 9999px;
    color: var(--text-muted);
  }

  .bd-goal-row {
    display: flex;
    align-items: baseline;
    gap: 0.45rem;
    font-family: var(--font-sans);
    font-size: 0.78rem;
    line-height: 1.45;
  }

  .bd-goal-label {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    font-weight: 600;
    color: var(--text);
    white-space: nowrap;
    flex-shrink: 0;
  }

  .bd-goal-label :global(svg) {
    transform: translateY(1px);
  }

  .bd-goal-text {
    color: var(--text-secondary);
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
    color: var(--text-muted);
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
  }

  .bd-label :global(svg) {
    transform: translateY(1px);
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
    background: var(--pill-bg);
    border: 1px solid var(--border);
    border-radius: 9999px;
    color: var(--pill-text);
  }

  .op-pill {
    font-family: var(--font-sans);
    font-size: 0.7rem;
    padding: 0.15rem 0.55rem;
    background: var(--pill-bg);
    border-radius: 9999px;
    color: var(--text-secondary);
  }

  .artifact-pill {
    font-family: var(--font-mono, monospace);
    font-size: 0.75rem;
    font-weight: 600;
    padding: 0.2rem 0.65rem;
    background: var(--pill-bg);
    border: 1px solid var(--border);
    border-radius: 9999px;
    color: var(--text);
    display: inline-block;
  }
</style>
