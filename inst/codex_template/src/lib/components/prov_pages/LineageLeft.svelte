<script lang="ts">
  let { provData } = $props<{ provData: any }>();

  const entities = $derived(provData?.entity || {});

  const snapshots = $derived(
    Object.entries(entities)
      .filter(([k, e]: [string, any]) => e['rdt:type'] === 'Snapshot')
      .map(([id, e]: [string, any]) => ({
        id,
        name: e['rdt:name'] || id,
        value: e['rdt:value'] || 'Recorded',
        type: e['rdt:valType'] || 'Variable'
      }))
  );
</script>

<div class="lineage-page">
  <p class="chapter-label">Chapter 4</p>
  <h2>Variable Snapshots</h2>
  <p class="subtitle">Inspecting computational state across recorded operations.</p>

  <div class="snapshot-list">
    {#each snapshots as snap}
      <div class="glass-snap-card">
        <div class="snap-head">
          <span class="snap-name">{snap.name}</span>
          <span class="snap-type">{snap.type}</span>
        </div>
        <div class="snap-body">
          <code class="snap-val">{snap.value}</code>
        </div>
      </div>
    {/each}
  </div>
</div>

<style>
  .lineage-page {
    min-height: 100%;
    display: flex;
    flex-direction: column;
  }
  .lineage-page h2 {
    margin-top: 0.2rem;
    margin-bottom: 0.2rem;
    color: var(--text);
  }
  .subtitle {
    margin-bottom: 1.2rem;
    color: var(--text-secondary);
  }

  .snapshot-list {
    display: flex;
    flex-direction: column;
    gap: 0.45rem;
    overflow-y: auto;
    padding-right: 0.2rem;
  }

  /* Liquid Glass Snap Card */
  .glass-snap-card {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
    padding: 0.65rem 1rem;
    background: var(--glass-bg);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    border: 1px solid var(--glass-border);
    border-radius: 16px;
    box-shadow: var(--glass-shadow);
    transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), background 0.2s;
  }

  .glass-snap-card:hover {
    transform: translateY(-1px);
    background: var(--glass-bg-hover);
  }

  .snap-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .snap-name {
    font-family: var(--font-mono, monospace);
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--text);
  }

  .snap-type {
    font-family: var(--font-sans);
    font-size: 0.65rem;
    color: var(--text-muted);
  }

  .snap-body {
    font-family: var(--font-mono, monospace);
    font-size: 0.73rem;
  }

  .snap-val {
    color: var(--text-secondary);
    word-break: break-word;
  }
</style>
