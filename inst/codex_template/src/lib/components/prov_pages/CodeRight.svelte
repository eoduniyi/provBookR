<script lang="ts">
  import { activeScriptState, currentScriptMeta, currentScenarioMetadata } from '../../state.svelte';
  import { themeState } from '../../themeState.svelte';
  import Icon from '../Icon.svelte';
  import Prism from 'prismjs';
  import 'prismjs/components/prism-r';

  const scripts = $derived(Object.values(currentScenarioMetadata()));
  const activeMeta = $derived(currentScriptMeta());

  const highlightedCode = $derived(
    activeMeta ? Prism.highlight(activeMeta.code, Prism.languages.r, 'r') : ''
  );
</script>

<div class="code-right-container">
  <!-- Tab Bar -->
  <div class="tab-bar">
    {#each scripts as sc}
      <button 
        class="tab-pill" 
        class:active={activeScriptState.currentId === sc.id}
        onclick={() => activeScriptState.currentId = sc.id}
      >
        <Icon name={sc.icon} size={14} />
        <span class="tab-label">{sc.name}</span>
      </button>
    {/each}
  </div>

  <!-- E-Ink Paper View -->
  <div class="eink-paper">
    {#if activeMeta}
      <div class="paper-header">
        <div class="header-left">
          <span class="file-tag">R Script</span>
          <span class="file-title">{activeMeta.name}</span>
        </div>
        <span class="file-cat">{activeMeta.category}</span>
      </div>

      <!-- Quick Flow Bar -->
      <div class="flow-bar">
        <span class="flow-item">Variables: <code>{activeMeta.variables.join(', ')}</code></span>
        <span class="flow-sep">→</span>
        <span class="flow-item">Output: <code>{activeMeta.outputFile}</code></span>
      </div>

      <!-- Source Code Display -->
      <div class="code-scroll">
        <pre class="eink-code"><code class="language-r"><!-- eslint-disable-next-line svelte/no-at-html-tags -->
{@html highlightedCode}</code></pre>
      </div>
    {:else}
      <p class="empty-msg">No script selected.</p>
    {/if}
  </div>
</div>

<style>
  .code-right-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    gap: 0.7rem;
  }

  /* Liquid Glass Tab Pills */
  .tab-bar {
    display: flex;
    gap: 0.45rem;
    overflow-x: auto;
    padding: 0.2rem 0.1rem;
  }

  .tab-pill {
    all: unset;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.4rem 0.85rem;
    background: rgba(255, 255, 255, 0.6);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(0, 0, 0, 0.06);
    border-radius: 9999px;
    font-family: var(--font-mono, monospace);
    font-size: 0.72rem;
    color: var(--text-muted, #8e8e9e);
    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
  }

  .tab-pill:hover {
    background: rgba(255, 255, 255, 0.85);
    color: var(--text, #1a1a24);
    transform: translateY(-1px);
  }

  .tab-pill.active {
    background: #ffffff;
    border-color: rgba(0, 0, 0, 0.12);
    color: var(--text, #1a1a24);
    font-weight: 600;
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.05);
  }

  .tab-icon {
    font-size: 0.75rem;
  }

  /* E-Ink Paper */
  .eink-paper {
    flex: 1;
    background: #ffffff;
    border: 1px solid rgba(0, 0, 0, 0.08);
    border-radius: 20px;
    padding: 1.3rem 1.5rem;
    display: flex;
    flex-direction: column;
    box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.03);
    overflow: hidden;
  }

  .paper-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 0.6rem;
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
    font-family: var(--font-mono, monospace);
  }

  .header-left {
    display: flex;
    align-items: center;
    gap: 0.6rem;
  }

  .file-tag {
    font-size: 0.62rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    padding: 0.15rem 0.5rem;
    background: var(--bg-warm, #fbfaf8);
    border: 1px solid rgba(0, 0, 0, 0.06);
    border-radius: 9999px;
    color: var(--text-muted, #8e8e9e);
  }

  .file-title {
    font-size: 0.8rem;
    font-weight: 700;
    color: var(--text, #1a1a24);
  }

  .file-cat {
    font-family: var(--font-sans);
    font-size: 0.64rem;
    color: var(--text-muted, #8e8e9e);
  }

  /* Flow Bar inside E-ink Paper */
  .flow-bar {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.4rem 0.8rem;
    margin: 0.75rem 0 1rem;
    background: var(--bg-warm, #fbfaf8);
    border: 1px solid rgba(0, 0, 0, 0.04);
    border-radius: 12px;
    font-family: var(--font-mono, monospace);
    font-size: 0.7rem;
    color: var(--text-secondary, #4a4a5a);
  }

  .flow-sep {
    color: var(--text-muted, #8e8e9e);
    font-weight: 700;
  }

  .code-scroll {
    flex: 1;
    overflow-y: auto;
    padding-right: 0.5rem;
  }

  .eink-code {
    font-family: var(--font-mono, monospace);
    font-size: 0.8rem;
    line-height: 1.75;
    color: #18181b;
    white-space: pre-wrap;
    word-break: break-word;
    margin: 0;
  }

  .empty-msg {
    color: var(--text-muted);
    font-style: italic;
    font-size: 0.85rem;
  }
</style>
