<script lang="ts">
  import { currentScenario } from '../../state.svelte';
  
  const scenario = $derived(currentScenario());
</script>

<div class="intro-page">
  <p class="chapter-label">Section 1</p>
  <h2>{scenario.name}</h2>
  <p class="subtitle">{scenario.description}</p>

  <p>
    {#if scenario.id === 'everyday'}
      Whether you are drafting a research proposal, scaling a baking recipe, or calculating your weekly coffee expense,
      every computational task follows a natural flow:
    {:else}
      In high-performance computing pipelines, from graph construction to iterative solvers,
      every computational task follows a natural flow:
    {/if}
  </p>

  <!-- Flow Breakdown Cards (Liquid Glass Bubble Pills) -->
  <div class="flow-container">
    <div class="flow-pill">
      <div class="pill-badge">1</div>
      <div class="pill-content">
        <h4>Inputs (Data)</h4>
        <p>Values, parameters, text drafts, or initial raw files fed into the script.</p>
      </div>
    </div>

    <div class="flow-pill">
      <div class="pill-badge">2</div>
      <div class="pill-content">
        <h4>Operations (Logic)</h4>
        <p>Function calls, math formulas, and string transformations that process the data.</p>
      </div>
    </div>

    <div class="flow-pill">
      <div class="pill-badge">3</div>
      <div class="pill-content">
        <h4>Outputs (Artifacts)</h4>
        <p>Final variables, summary tables, generated PDFs, or exported CSV files.</p>
      </div>
    </div>
  </div>

  <div class="note">
    <strong>Key Idea:</strong> Provenance records the exact lineage connecting these three steps, so anyone can trace a final artifact back to its origin.
  </div>
</div>

<style>
  .intro-page {
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: 100%;
  }
  .intro-page h2 {
    margin-top: 0.2rem;
    margin-bottom: 0.3rem;
    color: var(--text);
  }
  .subtitle {
    margin-bottom: 1.2rem;
    color: var(--text-secondary);
  }

  .flow-container {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
    margin: 1.2rem 0;
  }

  /* Liquid Glass Bubble Pill */
  .flow-pill {
    display: flex;
    align-items: flex-start;
    gap: 0.9rem;
    padding: 0.85rem 1.2rem;
    background: var(--glass-bg);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    border: 1px solid var(--glass-border);
    border-radius: 20px;
    box-shadow: var(--glass-shadow);
    transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), background 0.2s, box-shadow 0.2s;
  }

  .flow-pill:hover {
    transform: translateY(-1px);
    background: var(--glass-bg-hover);
  }

  .pill-badge {
    flex-shrink: 0;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: var(--pill-badge-bg, var(--text));
    color: var(--pill-badge-text, #ffffff);
    font-family: var(--font-mono, monospace);
    font-size: 0.72rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 0.1rem;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  }

  .pill-content h4 {
    font-family: var(--font-sans);
    font-size: 0.82rem;
    font-weight: 600;
    color: var(--text);
    margin: 0 0 0.15rem;
  }

  .pill-content p {
    font-family: var(--font-sans);
    font-size: 0.75rem;
    color: var(--text-secondary);
    margin: 0;
    line-height: 1.45;
  }
</style>
