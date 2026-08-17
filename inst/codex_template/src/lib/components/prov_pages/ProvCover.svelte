<script lang="ts">
  let { provData } = $props<{ provData: any }>();

  let environment = $derived(provData?.entity?.['rdt:environment'] || {});
  let scriptName = $derived(environment?.['rdt:script'] || 'Unknown Script');
  let executionTime = $derived(environment?.['rdt:provTimestamp']?.replace(/\./g, ':') || '');
  let architecture = $derived(environment?.['rdt:architecture'] || '');
  let os = $derived(environment?.['rdt:operatingSystem'] || '');
  let rVersion = $derived(environment?.['rdt:langVersion'] || '');
  let totalTime = $derived(environment?.['rdt:totalElapsedTime'] || '');

  // Count activities and entities
  const activities = $derived(provData?.activity || {});
  const entities = $derived(provData?.entity || {});
  const actCount = $derived(Object.keys(activities).length);
  const entCount = $derived(Object.keys(entities).filter(k => !k.includes('environment')).length);
</script>

<div class="cover">
  <p class="chapter-label">Provenance Codex</p>
  <h1>{scriptName}</h1>
  <p class="subtitle">An interactive record of code execution,<br>data lineage, and computational history.</p>

  <div class="meta-table">
    <div class="meta-row">
      <span class="meta-key">Language</span>
      <span class="meta-val">{rVersion}</span>
    </div>
    <div class="meta-row">
      <span class="meta-key">System</span>
      <span class="meta-val">{os} ({architecture})</span>
    </div>
    <div class="meta-row">
      <span class="meta-key">Recorded</span>
      <span class="meta-val">{executionTime}</span>
    </div>
    <div class="meta-row">
      <span class="meta-key">Duration</span>
      <span class="meta-val">{totalTime}s</span>
    </div>
  </div>

  <div class="stats">
    <div class="stat">
      <span class="stat-num">{actCount}</span>
      <span class="stat-label">Operations</span>
    </div>
    <div class="stat">
      <span class="stat-num">{entCount}</span>
      <span class="stat-label">Data Objects</span>
    </div>
  </div>

  <p class="hint">Click the right page or press → to begin</p>
</div>

<style>
  .cover {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 3rem 2rem;
    min-height: 100%;
    color: var(--text);
  }
  .cover h1 {
    font-size: 2.2rem;
    margin-bottom: 0.6rem;
    letter-spacing: -0.03em;
    color: var(--text);
  }
  .subtitle {
    color: var(--text-secondary);
  }
  .meta-table {
    width: 100%;
    max-width: 320px;
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
    padding: 1.2rem 0;
    margin: 2rem 0;
  }
  .meta-row {
    display: flex;
    justify-content: space-between;
    padding: 0.3rem 0;
    font-family: var(--font-mono, monospace);
    font-size: 0.78rem;
  }
  .meta-key { color: var(--text-muted); }
  .meta-val { color: var(--text); font-weight: 600; }
  .stats {
    display: flex;
    gap: 3rem;
    margin: 1rem 0 2rem;
  }
  .stat {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .stat-num {
    font-size: 2rem;
    font-weight: 700;
    color: var(--accent);
    line-height: 1;
  }
  .stat-label {
    font-family: var(--font-sans);
    font-size: 0.72rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--text-muted);
    margin-top: 0.3rem;
  }
  .hint {
    font-family: var(--font-sans);
    font-size: 0.75rem;
    color: var(--text-muted);
    margin-top: 1rem;
  }
</style>
