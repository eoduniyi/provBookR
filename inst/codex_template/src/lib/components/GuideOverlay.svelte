<script lang="ts">
  import { bookNavigationState, guideState } from '../state.svelte';
  import { scenarios } from '../data/scenarios';
  import { activeScenarioState } from '../state.svelte';
  import type { GuideCaption } from '../data/scenarios';

  const guide = $derived(scenarios[activeScenarioState.currentId].guide);
  const caption: GuideCaption | undefined = $derived(guide?.[bookNavigationState.currentSpread]);
  const totalSpreads = $derived(guide?.length ?? 0);
  const spreadIndex = $derived(bookNavigationState.currentSpread);

  function dismiss() {
    guideState.enabled = false;
  }
</script>

{#if guideState.enabled && caption}
  <div class="guide-overlay" role="status" aria-live="polite">
    <div class="guide-card">
      <div class="guide-header">
        <span class="guide-step">{spreadIndex + 1} / {totalSpreads}</span>
        <button class="guide-dismiss" onclick={dismiss} aria-label="Dismiss guide">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <h4 class="guide-title">{caption.title}</h4>
      <p class="guide-body">{caption.body}</p>

      {#if caption.lookAt}
        <div class="guide-hint">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" />
          </svg>
          <span>{caption.lookAt}</span>
        </div>
      {/if}

      <div class="guide-nav-hint">
        {#if spreadIndex < totalSpreads - 1}
          <span>Flip to the next page →</span>
        {:else}
          <span>You've reached the last chapter</span>
        {/if}
      </div>
    </div>
  </div>
{/if}

<style>
  .guide-overlay {
    position: fixed;
    top: 2.5rem;
    right: 5.5rem;
    z-index: 900;
    max-width: 320px;
    animation: guideSlideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    pointer-events: auto;
  }

  @keyframes guideSlideIn {
    from {
      opacity: 0;
      transform: translateY(-12px) scale(0.97);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  .guide-card {
    background: var(--code-paper-bg, #ffffff);
    border: 1px solid var(--border, rgba(0, 0, 0, 0.12));
    border-radius: 18px;
    padding: 1.15rem 1.35rem;
    box-shadow: 
      0 12px 36px -4px rgba(0, 0, 0, 0.18),
      0 2px 8px rgba(0, 0, 0, 0.06);
  }

  .guide-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.6rem;
  }

  .guide-step {
    font-family: var(--font-mono, monospace);
    font-size: 0.65rem;
    font-weight: 700;
    color: var(--text-muted, #94a3b8);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    background: var(--pill-bg, rgba(0, 0, 0, 0.05));
    padding: 0.2rem 0.6rem;
    border-radius: 9999px;
  }

  .guide-dismiss {
    all: unset;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    color: var(--text-muted, #94a3b8);
    transition: all 0.15s;
  }
  .guide-dismiss:hover {
    background: var(--pill-bg, rgba(0, 0, 0, 0.06));
    color: var(--text, #1a1a24);
  }

  .guide-title {
    margin: 0 0 0.4rem;
    font-family: var(--font-sans);
    font-size: 0.95rem;
    font-weight: 700;
    color: var(--text, #1a1a24);
    line-height: 1.3;
  }

  .guide-body {
    margin: 0 0 0.6rem;
    font-family: var(--font-sans);
    font-size: 0.78rem;
    color: var(--text-secondary, #4a4a5a);
    line-height: 1.55;
  }

  .guide-hint {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    padding: 0.55rem 0.7rem;
    background: var(--pill-bg, rgba(37, 99, 235, 0.06));
    border: 1px solid var(--border, rgba(37, 99, 235, 0.12));
    border-radius: 10px;
    margin-bottom: 0.6rem;
  }
  .guide-hint svg {
    flex-shrink: 0;
    color: var(--accent);
    margin-top: 1px;
  }
  .guide-hint span {
    font-family: var(--font-sans);
    font-size: 0.72rem;
    color: var(--text-body, #242432);
    font-weight: 500;
    line-height: 1.45;
  }

  .guide-nav-hint {
    text-align: center;
    padding-top: 0.4rem;
    border-top: 1px solid var(--border, rgba(0, 0, 0, 0.05));
  }
  .guide-nav-hint span {
    font-family: var(--font-sans);
    font-size: 0.65rem;
    color: var(--text-muted, #94a3b8);
    font-style: italic;
  }
</style>
