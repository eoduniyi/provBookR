<script lang="ts">
  let { provData } = $props<{ provData: any }>();

  const usedRels = provData?.used || {};
  const genRels = provData?.wasGeneratedBy || {};
  const entities = provData?.entity || {};
  const activities = provData?.activity || {};

  type EdgeDesc = { source: string; target: string; verb: string };
  const edgeDescs: EdgeDesc[] = [];

  Object.values(genRels).forEach((g: any) => {
    const actName = activities[g['prov:activity']]?.['rdt:name'] || g['prov:activity'];
    const entName = entities[g['prov:entity']]?.['rdt:name'] || g['prov:entity'];
    const shortAct = actName.length > 28 ? actName.slice(0, 26) + '…' : actName;
    edgeDescs.push({ source: shortAct, target: entName, verb: 'generated' });
  });

  Object.values(usedRels).forEach((u: any) => {
    const entName = entities[u['prov:entity']]?.['rdt:name'] || u['prov:entity'];
    const actName = activities[u['prov:activity']]?.['rdt:name'] || u['prov:activity'];
    const shortAct = actName.length > 28 ? actName.slice(0, 26) + '…' : actName;
    edgeDescs.push({ source: shortAct, target: entName, verb: 'used' });
  });
</script>

<div class="derivation-page">
  <h3>Derivation Edges</h3>
  <p class="deriv-intro">
    All <strong>generated</strong> (creates value) and <strong>used</strong> (reads value) derivation edges.
  </p>

  <div class="edge-list">
    {#each edgeDescs as edge}
      <div class="glass-edge-pill">
        <span class="edge-source">{edge.source}</span>
        <span class="edge-arrow">
          {#if edge.verb === 'generated'}→{:else}←{/if}
        </span>
        <span class="edge-target">{edge.target}</span>
        <span class="edge-verb">{edge.verb}</span>
      </div>
    {/each}
  </div>

  <div class="colophon">
    <p>
      Published by <strong>provBookR</strong> · End-to-End Provenance
    </p>
  </div>
</div>

<style>
  .derivation-page {
    min-height: 100%;
    display: flex;
    flex-direction: column;
  }
  .derivation-page h3 {
    margin-top: 0;
  }
  .deriv-intro {
    font-size: 0.85rem;
    color: var(--text-secondary, #4a4a5a);
    margin-bottom: 1rem;
  }

  .edge-list {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.45rem;
    overflow-y: auto;
    padding-right: 0.3rem;
  }

  /* Liquid Glass Edge Pill */
  .glass-edge-pill {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.9rem;
    background: rgba(255, 255, 255, 0.65);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.85);
    border-radius: 9999px; /* full liquid pill */
    font-family: var(--font-mono, monospace);
    font-size: 0.73rem;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.02);
    transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), background 0.2s;
  }

  .glass-edge-pill:hover {
    transform: translateY(-1px);
    background: rgba(255, 255, 255, 0.85);
  }

  .edge-source {
    color: var(--text, #1a1a24);
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-weight: 500;
  }

  .edge-arrow {
    color: var(--text, #1a1a24);
    font-weight: 700;
    flex-shrink: 0;
  }

  .edge-target {
    color: var(--text, #1a1a24);
    font-weight: 600;
    flex-shrink: 0;
  }

  .edge-verb {
    font-family: var(--font-sans);
    font-size: 0.6rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--text-muted, #8e8e9e);
    flex-shrink: 0;
    width: 58px;
    text-align: right;
  }

  .colophon {
    margin-top: 1.5rem;
    padding-top: 0.8rem;
    border-top: 1px solid var(--border, rgba(0,0,0,0.07));
    font-family: var(--font-sans);
    font-size: 0.72rem;
    color: var(--text-muted, #8e8e9e);
    text-align: center;
  }
</style>
