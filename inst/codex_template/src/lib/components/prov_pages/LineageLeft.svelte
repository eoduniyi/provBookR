<script lang="ts">
  let { provData } = $props<{ provData: any }>();

  const entities = provData?.entity || {};

  const snapshots = Object.entries(entities)
    .filter(([k, e]: [string, any]) => e['rdt:type'] === 'Snapshot')
    .map(([id, e]: [string, any]) => ({
      id,
      name: e['rdt:name'] || id,
      value: e['rdt:value'] || 'Recorded',
      type: e['rdt:valType'] || 'Variable'
    }));
</script>

<div class="lineage-page">
  <p class="chapter-label">Chapter 4</p>
  <h2>Variable Snapshots</h2>
  <p class="subtitle">Inspecting computational state across all 5 examples.</p>

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
  }
  .subtitle {
    margin-bottom: 1.2rem;
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
    background: rgba(255, 255, 255, 0.65);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    border: 1px solid rgba(255, 255, 255, 0.85);
    border-radius: 16px;
    box-shadow: 0 4px 16px -2px rgba(0, 0, 0, 0.02);
    transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .glass-snap-card:hover {
    transform: translateY(-1px);
    background: rgba(255, 255, 255, 0.85);
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
    color: var(--text, #1a1a24);
  }

  .snap-type {
    font-family: var(--font-sans);
    font-size: 0.65rem;
    color: var(--text-muted, #8e8e9e);
  }

  .snap-body {
    font-family: var(--font-mono, monospace);
    font-size: 0.73rem;
  }

  .snap-val {
    color: var(--text-secondary, #4a4a5a);
    word-break: break-word;
  }
</style>
