<script lang="ts">
  import { typeComposerState, type TypeElement } from '../typeComposerState.svelte';

  let { pageKey = 'blank-1-left' } = $props<{ pageKey?: string }>();

  let elements = $derived(typeComposerState.getElements(pageKey));
  let isDragging = $state(false);
  let dragId = $state<string | null>(null);
  let dragOffsetX = $state(0);
  let dragOffsetY = $state(0);

  let editingId = $state<string | null>(null);
  let editingText = $state('');

  function handlePointerDown(e: PointerEvent, item: TypeElement, container: HTMLElement) {
    if (editingId) return; // don't start drag if editing inline
    e.stopPropagation();
    
    // Select item
    typeComposerState.selectedIds = new Set([item.id]);

    // Calculate drag offset relative to container
    const rect = container.getBoundingClientRect();
    const itemPxX = (item.x / 100) * rect.width;
    const itemPxY = (item.y / 100) * rect.height;

    const clickPxX = e.clientX - rect.left;
    const clickPxY = e.clientY - rect.top;

    dragOffsetX = clickPxX - itemPxX;
    dragOffsetY = clickPxY - itemPxY;
    dragId = item.id;
    isDragging = true;

    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }

  function handlePointerMove(e: PointerEvent, container: HTMLElement) {
    if (!isDragging || !dragId) return;
    e.stopPropagation();

    const rect = container.getBoundingClientRect();
    const clickPxX = e.clientX - rect.left;
    const clickPxY = e.clientY - rect.top;

    const newPxX = clickPxX - dragOffsetX;
    const newPxY = clickPxY - dragOffsetY;

    const newX = Math.max(2, Math.min(92, (newPxX / rect.width) * 100));
    const newY = Math.max(5, Math.min(92, (newPxY / rect.height) * 100));

    typeComposerState.updateElement(pageKey, dragId, {
      x: Math.round(newX * 10) / 10,
      y: Math.round(newY * 10) / 10
    });
  }

  function handlePointerUp(e: PointerEvent) {
    if (isDragging) {
      isDragging = false;
      dragId = null;
    }
  }

  function startInlineEdit(item: TypeElement) {
    editingId = item.id;
    editingText = item.text;
  }

  function finishInlineEdit() {
    if (editingId) {
      typeComposerState.updateElement(pageKey, editingId, { text: editingText });
      editingId = null;
    }
  }

  function handleKeyDown(e: KeyboardEvent) {
    const target = e.target as HTMLElement | null;
    const isTyping = target && (
      target.tagName === 'INPUT' || 
      target.tagName === 'TEXTAREA' || 
      target.isContentEditable ||
      Boolean(target.closest('input, textarea, [contenteditable]'))
    );
    if (isTyping && !editingId) return;

    if (editingId) {
      if (e.key === 'Enter') finishInlineEdit();
      if (e.key === 'Escape') editingId = null;
      return;
    }

    if (e.key === 'Delete' || e.key === 'Backspace') {
      typeComposerState.selectedIds.forEach(id => {
        typeComposerState.deleteElement(pageKey, id);
      });
    }

    if (e.key === 'r' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      typeComposerState.resetToZeroState(pageKey);
    }
  }
</script>

<svelte:window onkeydown={handleKeyDown} />

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div 
  class="type-composer-container" 
  onclick={() => {
    typeComposerState.selectedIds = new Set();
    if (editingId) finishInlineEdit();
  }}
>
  {#each elements as item (item.id)}
    {@const isSelected = typeComposerState.selectedIds.has(item.id)}
    {@const isEditing = editingId === item.id}

    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
      class="spatial-text-node"
      class:selected={isSelected}
      class:editing={isEditing}
      class:serif={item.fontFamily === 'serif'}
      class:mono={item.fontFamily === 'mono'}
      class:sans={item.fontFamily === 'sans'}
      class:italic={item.isItalic}
      style="
        left: {item.x}%; 
        top: {item.y}%; 
        font-size: {item.fontSize}px; 
        font-weight: {item.fontWeight}; 
        transform: rotate({item.rotation}deg);
        opacity: {item.opacity};
      "
      onpointerdown={(e) => {
        const container = (e.currentTarget as HTMLElement).closest('.type-composer-container') as HTMLElement;
        if (container) handlePointerDown(e, item, container);
      }}
      onpointermove={(e) => {
        const container = (e.currentTarget as HTMLElement).closest('.type-composer-container') as HTMLElement;
        if (container) handlePointerMove(e, container);
      }}
      onpointerup={handlePointerUp}
      ondblclick={(e) => {
        e.stopPropagation();
        startInlineEdit(item);
      }}
    >
      {#if isEditing}
        <input 
          type="text" 
          class="inline-edit-input" 
          bind:value={editingText}
          onblur={finishInlineEdit}
          autoFocus
        />
      {:else}
        <span class="node-text">{item.text}</span>
      {/if}
    </div>
  {/each}
</div>

<style>
  .type-composer-container {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    z-index: 10;
    pointer-events: auto;
    overflow: hidden;
    user-select: none;
    -webkit-user-select: none;
  }

  .spatial-text-node {
    position: absolute;
    cursor: grab;
    padding: 0.15rem 0.4rem;
    border-radius: 6px;
    border: 1px solid transparent;
    white-space: nowrap;
    line-height: 1.25;
    color: var(--text, #1a1a24);
    /* Smooth 0.4s transition for zero-state resets */
    transition: left 0.4s cubic-bezier(0.16, 1, 0.3, 1), 
                top 0.4s cubic-bezier(0.16, 1, 0.3, 1), 
                transform 0.4s cubic-bezier(0.16, 1, 0.3, 1),
                opacity 0.4s ease;
  }

  .spatial-text-node:active { cursor: grabbing; }

  .spatial-text-node.serif { font-family: var(--font-body, serif); }
  .spatial-text-node.mono { font-family: var(--font-mono, monospace); }
  .spatial-text-node.sans { font-family: var(--font-sans, sans-serif); }
  .spatial-text-node.italic { font-style: italic; }

  .spatial-text-node:hover {
    background: var(--glass-bg-hover, rgba(0, 0, 0, 0.04));
    border-color: var(--border, rgba(0, 0, 0, 0.08));
  }

  .spatial-text-node.selected {
    border-color: var(--pill-badge-bg, #1a1a24);
    background: var(--glass-bg, rgba(255, 255, 255, 0.6));
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.12);
  }

  .inline-edit-input {
    all: unset;
    font-family: inherit;
    font-size: inherit;
    font-weight: inherit;
    color: inherit;
    background: transparent;
    border-bottom: 2px solid var(--text, #1a1a24);
    min-width: 60px;
  }
</style>
