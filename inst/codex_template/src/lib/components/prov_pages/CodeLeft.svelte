<script lang="ts">
  import { themeState } from '../../themeState.svelte';
  import { parseProvData } from '../../data/provParser';
  import scriptSource from '../../data/script_source.json';
  import Icon from '../Icon.svelte';

  let { provData, active = true } = $props<{ provData?: any; active?: boolean }>();

  const parsed = $derived(provData ? parseProvData(provData, scriptSource) : null);
  const isLight = $derived(themeState.readingMode === 'light');

  const displayedVars = $derived(
    parsed ? (isLight ? parsed.variables.slice(0, Math.min(4, parsed.variables.length)) : parsed.variables) : []
  );
  const displayedOps = $derived(
    parsed ? (isLight ? parsed.activities.slice(0, Math.min(3, parsed.activities.length)) : parsed.activities.slice(0, 6)) : []
  );
</script>

<div class="code-left-page" class:mode-light={isLight}>
  <p class="chapter-label">Chapter 2: Source Code</p>
  <h2>Source Code Breakdown</h2>
  <p class="section-desc">
    Execution profile and structural analysis for <code>{parsed?.scriptName || 'Analysis Script'}</code>.
  </p>

  {#if parsed}
    <!-- Active Script Breakdown Card (Liquid Glass Bubble) -->
    <div class="glass-breakdown-card">
      <div class="breakdown-header">
        <Icon name="document" size={18} />
        <div>
          <h3>{parsed.scriptName}</h3>
          <span class="breakdown-cat">{parsed.langVersion} • {parsed.operationsCount} Operations</span>
        </div>
      </div>

      <div class="breakdown-body">
        <div class="breakdown-row">
          <span class="row-label">Variables ({parsed.variables.length}):</span>
          <div class="tag-wrap">
            {#each displayedVars as v}
              <span class="var-tag"><code>{v.name}</code> ({v.type})</span>
            {/each}
            {#if isLight && parsed.variables.length > 4}
              <span class="more-pill">+{parsed.variables.length - displayedVars.length} more in @detailedmode</span>
            {/if}
          </div>
        </div>

        <div class="breakdown-row">
          <span class="row-label">Artifacts ({parsed.outputArtifacts.length}):</span>
          <div class="tag-wrap">
            {#each parsed.outputArtifacts as a}
              <span class="out-tag"><code>{a.name}</code></span>
            {/each}
            {#if parsed.outputArtifacts.length === 0}
              <span class="dim-text">In-memory workspace</span>
            {/if}
          </div>
        </div>

        <div class="breakdown-row">
          <span class="row-label">Statements:</span>
          <div class="op-list">
            {#each displayedOps as act}
              <div class="op-item">
                <span class="op-time">{act.elapsedTime}s</span>
                <code class="op-code">{act.name}</code>
              </div>
            {/each}
            {#if isLight && parsed.activities.length > 3}
              <span class="more-pill">+{parsed.activities.length - displayedOps.length} more in @detailedmode</span>
            {/if}
          </div>
        </div>
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
    margin-bottom: 0.8rem;
  }
  .section-desc code {
    font-family: var(--font-mono, monospace);
    font-size: 0.74rem;
    padding: 0.1rem 0.35rem;
    background: var(--pill-bg, rgba(0, 0, 0, 0.05));
    border-radius: 4px;
  }

  .glass-breakdown-card {
    background: var(--glass-bg);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    border: 1px solid var(--glass-border);
    border-radius: 16px;
    padding: 0.9rem 1.1rem;
    box-shadow: var(--glass-shadow);
  }

  .breakdown-header {
    display: flex;
    align-items: center;
    gap: 0.7rem;
    border-bottom: 1px solid var(--border);
    padding-bottom: 0.6rem;
    margin-bottom: 0.6rem;
  }

  .breakdown-header h3 {
    margin: 0;
    font-size: 0.88rem;
    color: var(--text);
  }

  .breakdown-cat {
    font-family: var(--font-mono, monospace);
    font-size: 0.65rem;
    color: var(--text-muted);
  }

  .breakdown-body {
    display: flex;
    flex-direction: column;
    gap: 0.55rem;
  }

  .breakdown-row {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .row-label {
    font-family: var(--font-sans);
    font-size: 0.7rem;
    font-weight: 600;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .tag-wrap {
    display: flex;
    flex-wrap: wrap;
    gap: 0.3rem;
  }

  .var-tag {
    font-family: var(--font-mono, monospace);
    font-size: 0.64rem;
    padding: 0.1rem 0.45rem;
    background: var(--pill-bg);
    border: 1px solid var(--border);
    border-radius: 9999px;
    color: var(--text);
  }

  .out-tag {
    font-family: var(--font-mono, monospace);
    font-size: 0.64rem;
    padding: 0.1rem 0.45rem;
    background: rgba(46, 125, 50, 0.1);
    border: 1px solid rgba(46, 125, 50, 0.25);
    border-radius: 9999px;
    color: #2e7d32;
    font-weight: 600;
  }

  .dim-text {
    font-size: 0.68rem;
    color: var(--text-muted);
  }

  .op-list {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
  }

  .op-item {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-family: var(--font-mono, monospace);
    font-size: 0.64rem;
    background: rgba(0, 0, 0, 0.03);
    padding: 0.15rem 0.4rem;
    border-radius: 4px;
  }

  .op-time {
    font-weight: 600;
    color: var(--accent);
    min-width: 38px;
  }

  .more-pill {
    font-family: var(--font-sans);
    font-size: 0.62rem;
    padding: 0.15rem 0.5rem;
    background: var(--pill-bg, rgba(0, 0, 0, 0.04));
    border-radius: 9999px;
    color: var(--text-muted);
    font-style: italic;
  }

  .op-code {
    color: var(--text);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
