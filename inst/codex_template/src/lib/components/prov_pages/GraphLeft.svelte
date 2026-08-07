<script lang="ts">
  let { provData } = $props<{ provData: any }>();
  import { activeScriptState, currentScenarioMetadata } from '../../state.svelte';
  import Icon from '../Icon.svelte';

  const scriptToNum: Record<string, number> = {
    "proposal_workflow.R": 1,
    "coffee_tracker.R": 2,
    "weather_analysis.R": 3,
    "recipe_scaling.R": 4,
    "student_grades.R": 5,
    "hyperspec_smoothing.R": 1
  };

  const scripts = $derived(Object.values(currentScenarioMetadata()));

  const activeNum = $derived(scriptToNum[activeScriptState.currentId] || 1);

  const filteredEntities = $derived.by(() => {
    const activities = provData?.activity || {};
    const wgBy = provData?.wasGeneratedBy || {};
    const used = provData?.used || {};
    const ents = provData?.entity || {};

    const scriptActivities = new Set(
      Object.entries(activities)
        .filter(([_, a]: [string, any]) => a['rdt:scriptNum'] === activeNum)
        .map(([k]) => k)
    );

    const relatedEntityIds = new Set<string>();
    Object.values(wgBy).forEach((edge: any) => {
      if (scriptActivities.has(edge['prov:activity'])) {
        relatedEntityIds.add(edge['prov:entity']);
      }
    });
    Object.values(used).forEach((edge: any) => {
      if (scriptActivities.has(edge['prov:activity'])) {
        relatedEntityIds.add(edge['prov:entity']);
      }
    });

    return Object.entries(ents).filter(([k, e]: [string, any]) => 
      relatedEntityIds.has(k) && e['rdt:type'] !== 'Environment' && k.startsWith('rdt:d')
    );
  });

  const snapshots = $derived(filteredEntities.filter(([_, e]) => e['rdt:type'] === 'Snapshot'));
  const files = $derived(filteredEntities.filter(([_, e]) => e['rdt:type'] === 'File'));
</script>

<div class="graph-intro">
  <p class="chapter-label">Section 3</p>
  <h2>Lineage &amp; Data Flow</h2>
  <p class="section-desc">
    Provenance records how each piece of data derived from computation.
    Below are the recorded variables and files for the selected script.
  </p>

  <div class="script-pill-grid">
    {#each scripts as sc}
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

  <div class="entity-section">
    <h3>Variables &amp; Data <span class="count">({snapshots.length})</span></h3>
    <div class="entity-grid">
      {#each snapshots as [id, ent]}
        <div class="glass-pill">
          <span class="ent-name">{ent['rdt:name']}</span>
          <span class="ent-value">{ent['rdt:value']}</span>
        </div>
      {/each}
      {#if snapshots.length === 0}
        <div class="empty-state">No variables recorded.</div>
      {/if}
    </div>
  </div>

  <div class="entity-section">
    <h3>Output Files <span class="count">({files.length})</span></h3>
    <div class="entity-grid">
      {#each files as [id, ent]}
        <div class="glass-pill file-pill">
          <span class="ent-name">{ent['rdt:name']}</span>
          <span class="ent-hash">{ent['rdt:hash'] || 'document'}</span>
        </div>
      {/each}
      {#if files.length === 0}
        <div class="empty-state">No files generated.</div>
      {/if}
    </div>
  </div>
</div>

<style>
  .graph-intro {
    min-height: 100%;
  }
  .graph-intro h2 {
    margin-top: 0.25rem;
  }
  .section-desc {
    font-size: 0.95rem;
    line-height: 1.5;
    color: var(--text-secondary, #4a4a5a);
    margin-bottom: 1.25rem;
  }
  .script-pill-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
  }
  .script-select-pill {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.45rem 0.8rem;
    font-size: 0.78rem;
    font-family: var(--font-sans);
    color: var(--text-secondary, #4a4a5a);
    background: rgba(255, 255, 255, 0.4);
    border: 1px solid rgba(0, 0, 0, 0.06);
    border-radius: 9999px;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .script-select-pill:hover {
    background: rgba(255, 255, 255, 0.7);
    color: var(--text, #1a1a24);
  }
  .script-select-pill.active {
    background: #1a1a24;
    color: #ffffff;
    border-color: #1a1a24;
    box-shadow: 0 4px 12px -2px rgba(0,0,0,0.15);
  }
  .sc-name {
    font-family: var(--font-mono, monospace);
    font-weight: 500;
  }
  .entity-section {
    margin-top: 1.5rem;
  }
  .entity-section h3 {
    font-family: var(--font-sans);
    font-size: 0.8rem;
    font-weight: 600;
    margin: 0 0 0.75rem;
  }
  .count {
    font-weight: 400;
    color: var(--text-muted, #8e8e9e);
  }
  .entity-grid {
    display: flex;
    flex-direction: column;
    gap: 0.45rem;
  }
  
  .glass-pill {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.6rem 1.1rem;
    background: rgba(255, 255, 255, 0.65);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    border: 1px solid rgba(255, 255, 255, 0.85);
    border-radius: 9999px;
    font-size: 0.8rem;
    gap: 0.75rem;
    box-shadow: 0 4px 16px -2px rgba(0, 0, 0, 0.02), inset 0 1px 1px rgba(255, 255, 255, 0.9);
    transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .glass-pill:hover {
    transform: translateY(-1px);
    background: rgba(255, 255, 255, 0.85);
  }

  .ent-name {
    font-family: var(--font-mono, monospace);
    color: var(--text, #1a1a24);
    font-weight: 600;
    white-space: nowrap;
  }
  .ent-value {
    font-family: var(--font-mono, monospace);
    color: var(--text-secondary, #4a4a5a);
    font-size: 0.74rem;
    text-align: right;
    word-break: break-word;
  }
  .file-pill {
    background: rgba(255, 255, 255, 0.8);
  }
  .ent-hash {
    font-family: var(--font-mono, monospace);
    font-size: 0.68rem;
    color: var(--text-muted, #8e8e9e);
  }
  .empty-state {
    font-size: 0.85rem;
    color: var(--text-muted, #8e8e9e);
    font-style: italic;
    padding: 0.5rem;
  }
</style>
