<script lang="ts">
  let { provData } = $props<{ provData: any }>();

  const activities = provData?.activity || {};
  const genRels = provData?.wasGeneratedBy || {};
  const usedRels = provData?.used || {};

  const operations = Object.entries(activities)
    .filter(([_, a]: [string, any]) => a['rdt:type'] === 'Operation')
    .map(([id, a]: [string, any]) => ({
      id,
      name: a['rdt:name'] || id,
      time: parseFloat(a['rdt:elapsedTime'] || '0'),
      line: a['rdt:startLine'] || '?',
      script: a['rdt:scriptNum'] || '?'
    }));

  const totalOps = operations.length;
  const totalTime = operations.reduce((sum, op) => sum + op.time, 0);
  const totalEdges = Object.keys(genRels).length + Object.keys(usedRels).length;
</script>

<div class="output-intro">
  <p class="chapter-label">Section 5</p>
  <h2>Execution Timeline</h2>
  <p>
    Each operation below represents a single step in the computation.
    Together they form the full execution trace — a record of
    <em>what happened, when, and in what order</em>.
  </p>

  <div class="glass-summary">
    <div class="summary-stat">
      <span class="ss-val">{totalOps}</span>
      <span class="ss-key">steps</span>
    </div>
    <div class="summary-stat">
      <span class="ss-val">{totalTime.toFixed(3)}s</span>
      <span class="ss-key">total</span>
    </div>
    <div class="summary-stat">
      <span class="ss-val">{totalEdges}</span>
      <span class="ss-key">edges</span>
    </div>
  </div>

  <div class="timeline">
    {#each operations as op, idx}
      <div class="glass-step">
        <div class="step-badge">{idx + 1}</div>
        <div class="step-body">
          <code class="step-code">{op.name}</code>
          <span class="step-meta">Line {op.line} · {op.time.toFixed(3)}s</span>
        </div>
      </div>
    {/each}
  </div>
</div>

<style>
  .output-intro {
    min-height: 100%;
  }
  .output-intro h2 {
    margin-top: 0.25rem;
  }

  .glass-summary {
    display: flex;
    justify-content: space-around;
    padding: 0.9rem 1.2rem;
    background: rgba(255, 255, 255, 0.65);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    border: 1px solid rgba(255, 255, 255, 0.85);
    border-radius: 9999px;
    margin: 1.5rem 0;
    box-shadow: 0 4px 16px -2px rgba(0, 0, 0, 0.02), inset 0 1px 1px rgba(255, 255, 255, 0.9);
  }

  .summary-stat {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .ss-val {
    font-family: var(--font-mono, monospace);
    font-size: 1.05rem;
    font-weight: 700;
    color: var(--text, #1a1a24);
  }
  .ss-key {
    font-family: var(--font-sans);
    font-size: 0.62rem;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--text-muted, #8e8e9e);
  }

  .timeline {
    display: flex;
    flex-direction: column;
    gap: 0.45rem;
  }

  .glass-step {
    display: flex;
    gap: 0.75rem;
    align-items: center;
    padding: 0.55rem 1rem;
    background: rgba(255, 255, 255, 0.65);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.85);
    border-radius: 9999px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.02);
    transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), background 0.2s;
  }

  .glass-step:hover {
    transform: translateY(-1px);
    background: rgba(255, 255, 255, 0.85);
  }

  .step-badge {
    flex-shrink: 0;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: var(--text, #1a1a24);
    color: #ffffff;
    font-family: var(--font-mono, monospace);
    font-size: 0.68rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .step-body {
    display: flex;
    flex-direction: column;
    gap: 0.1rem;
    min-width: 0;
  }
  .step-code {
    font-family: var(--font-mono, monospace);
    font-size: 0.76rem;
    color: var(--text, #1a1a24);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-weight: 500;
  }
  .step-meta {
    font-family: var(--font-sans);
    font-size: 0.64rem;
    color: var(--text-muted, #8e8e9e);
  }
</style>
