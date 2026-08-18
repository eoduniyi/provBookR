<script lang="ts">
  import { typeComposerState, type DeliveryMode, type LayoutMode, type TargetSide } from '../typeComposerState.svelte';
  import { bookNavigationState } from '../state.svelte';
  import Icon from './Icon.svelte';

  let textInput = $state('');

  const isCover = $derived(bookNavigationState.currentSpread === 0);
  const currentSpread = $derived(bookNavigationState.currentSpread);

  function setTargetSide(side: TargetSide) {
    typeComposerState.targetSide = side;
    if (side === 'left') {
      typeComposerState.activePageKey = isCover ? 'page-cover' : `spread-${currentSpread}-left`;
    } else if (side === 'right') {
      typeComposerState.activePageKey = `spread-${currentSpread}-right`;
    }
  }

  function handleSeed() {
    if (!typeComposerState.inputText.trim()) return;
    typeComposerState.seedTextForSpread(currentSpread, typeComposerState.inputText);
    // Keep inputText preserved so user doesn't have to re-type
  }

  function handleKeydown(e: KeyboardEvent) {
    e.stopPropagation();
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSeed();
    }
  }

  function handleZeroStateReset() {
    typeComposerState.resetToZeroStateForSpread(currentSpread);
  }

  function handleLayout(mode: LayoutMode) {
    typeComposerState.applyLayoutForSpread(currentSpread, mode);
  }

  function handleWacky() {
    typeComposerState.applyWackyDistortionForSpread(currentSpread);
  }

  function handleClear() {
    typeComposerState.clearPageForSpread(currentSpread);
  }
</script>

{#if typeComposerState.isOpen}
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <div 
    class="type-toolbar-popover" 
    onclick={(e) => e.stopPropagation()}
  >
    <div class="popover-header">
      <div class="header-title">
        <Icon name="type" size={15} />
        <span>Type Studio</span>
      </div>
      <button 
        class="close-btn" 
        onclick={() => typeComposerState.isOpen = false}
        aria-label="Close Type Studio"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
    </div>

    <!-- Target Page Selector (Left | Right | Both) -->
    {#if !isCover}
      <div class="target-page-row">
        <span class="target-label">Target:</span>
        <div class="target-pills">
          <button 
            class="target-btn" 
            class:active={typeComposerState.targetSide === 'left'}
            onclick={() => setTargetSide('left')}
          >
            Left
          </button>
          <button 
            class="target-btn" 
            class:active={typeComposerState.targetSide === 'right'}
            onclick={() => setTargetSide('right')}
          >
            Right
          </button>
          <button 
            class="target-btn" 
            class:active={typeComposerState.targetSide === 'both'}
            onclick={() => setTargetSide('both')}
          >
            Both
          </button>
        </div>
      </div>
    {:else}
      <div class="target-page-row">
        <span class="target-label">Target:</span>
        <span class="target-cover-tag">Cover Page</span>
      </div>
    {/if}

    <!-- Seed Input Box -->
    <div class="input-section">
      <div class="textarea-wrapper">
        <textarea 
          class="seed-textarea" 
          value={typeComposerState.inputText}
          oninput={(e) => typeComposerState.updateSelectedText(e.currentTarget.value)}
          onkeydown={handleKeydown}
          placeholder="Type a letter, word, or poem... (Enter to seed)"
          rows={2}
        ></textarea>
        {#if typeComposerState.inputText}
          <button 
            class="clear-input-btn" 
            onclick={() => {
              typeComposerState.selectedIds = new Set();
              typeComposerState.inputText = '';
            }}
            title="Deselect & Clear text box"
            aria-label="Deselect & Clear text box"
          >
            ✕
          </button>
        {/if}
      </div>
      <div class="input-actions">
        <div class="delivery-pills">
          <button 
            class="del-pill" 
            class:active={typeComposerState.deliveryMode === 'line-by-line'}
            onclick={() => typeComposerState.deliveryMode = 'line-by-line'}
          >
            Lines
          </button>
          <button 
            class="del-pill" 
            class:active={typeComposerState.deliveryMode === 'word-by-word'}
            onclick={() => typeComposerState.deliveryMode = 'word-by-word'}
          >
            Words
          </button>
          <button 
            class="del-pill" 
            class:active={typeComposerState.deliveryMode === 'scatter'}
            onclick={() => typeComposerState.deliveryMode = 'scatter'}
          >
            Scatter
          </button>
        </div>
        <button class="seed-btn" onclick={handleSeed}>
          <span>{typeComposerState.selectedIds.size === 1 ? 'Seed More' : 'Seed'}</span>
          <Icon name="sparkles" size={12} />
        </button>
      </div>
    </div>

    <div class="section-divider"></div>

    <!-- Zero State & Transformation Action Bar -->
    <div class="action-grid">
      <!-- ZERO STATE RESET BUTTON -->
      <button 
        class="zero-state-btn" 
        onclick={handleZeroStateReset}
        title="Reset all text to clean initial coherent render state (⌘+R)"
      >
        <Icon name="rotate-ccw" size={14} />
        <span>Reset Zero State</span>
      </button>

      <!-- WACKY DISTORTION BUTTON -->
      <button 
        class="wacky-btn" 
        onclick={handleWacky}
        title="Apply expressive spatial warp / rotation"
      >
        <Icon name="shuffle" size={14} />
        <span>Wacky Warp</span>
      </button>
    </div>

    <div class="section-divider"></div>

    <!-- Layout Presets -->
    <div class="ctrl-group">
      <div class="ctrl-label">Layout Presets</div>
      <div class="preset-pills">
        <button class="preset-btn" onclick={() => handleLayout('cascade')}>Cascade</button>
        <button class="preset-btn" onclick={() => handleLayout('center')}>Center</button>
        <button class="preset-btn" onclick={() => handleLayout('staircase')}>Staircase</button>
        <button class="preset-btn" onclick={() => handleLayout('grid')}>Grid</button>
        <button class="preset-btn" onclick={() => handleLayout('scatter')}>Scatter</button>
      </div>
    </div>

    <div class="section-divider"></div>

    <!-- Typography Controls -->
    <div class="ctrl-group">
      <div class="ctrl-label">Typography</div>
      <div class="typo-row">
        <div class="font-selector">
          <button 
            class="font-btn" 
            class:active={typeComposerState.fontFamily === 'serif'}
            onclick={() => typeComposerState.setFontFamily('serif')}
          >Serif</button>
          <button 
            class="font-btn" 
            class:active={typeComposerState.fontFamily === 'mono'}
            onclick={() => typeComposerState.setFontFamily('mono')}
          >Mono</button>
          <button 
            class="font-btn" 
            class:active={typeComposerState.fontFamily === 'sans'}
            onclick={() => typeComposerState.setFontFamily('sans')}
          >Sans</button>
        </div>

        <button 
          class="italic-btn" 
          class:active={typeComposerState.isItalic}
          onclick={() => typeComposerState.setItalic(!typeComposerState.isItalic)}
        >
          <em>I</em>
        </button>
      </div>

      <!-- Font Size Slider -->
      <div class="slider-row">
        <span class="slider-lbl">Size</span>
        <input 
          type="range" 
          min="12" 
          max="64" 
          step="1"
          value={typeComposerState.fontSize}
          oninput={(e) => typeComposerState.setFontSize(Number(e.currentTarget.value))}
          class="range-slider"
        />
        <span class="slider-val">{typeComposerState.fontSize}px</span>
      </div>

      <!-- Font Weight Slider -->
      <div class="slider-row">
        <span class="slider-lbl">Weight</span>
        <input 
          type="range" 
          min="200" 
          max="800" 
          step="100"
          value={typeComposerState.fontWeight}
          oninput={(e) => typeComposerState.setFontWeight(Number(e.currentTarget.value))}
          class="range-slider"
        />
        <span class="slider-val">{typeComposerState.fontWeight}</span>
      </div>
    </div>

    <div class="section-divider"></div>

    <!-- Clear Page -->
    <div class="bottom-bar">
      <button class="clear-btn" onclick={handleClear}>
        <Icon name="trash-2" size={13} />
        <span>Clear Page</span>
      </button>
    </div>
  </div>
{/if}

<style>
  .type-toolbar-popover {
    position: fixed;
    bottom: 4.5rem;
    left: 2rem;
    width: 320px;
    background: var(--glass-bg, rgba(255, 255, 255, 0.88));
    backdrop-filter: blur(24px) saturate(1.4);
    -webkit-backdrop-filter: blur(24px) saturate(1.4);
    border: 1px solid var(--glass-border, rgba(255, 255, 255, 0.3));
    border-radius: 20px;
    padding: 1.15rem;
    box-shadow: 
      0 16px 40px -8px rgba(0, 0, 0, 0.3),
      0 0 0 1px inset rgba(255, 255, 255, 0.15);
    z-index: 2000;
    color: var(--text);
    animation: popUp 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    transform-origin: bottom left;
  }

  @keyframes popUp {
    0% { opacity: 0; transform: scale(0.95) translateY(8px); }
    100% { opacity: 1; transform: scale(1) translateY(0); }
  }

  .popover-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.65rem;
  }

  .header-title {
    display: flex;
    align-items: center;
    gap: 0.45rem;
    font-family: var(--font-sans);
    font-size: 0.82rem;
    font-weight: 700;
    color: var(--text);
  }

  /* Target Page Row */
  .target-page-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.35rem 0.55rem;
    background: var(--pill-bg, rgba(0, 0, 0, 0.04));
    border: 1px solid var(--border, rgba(0, 0, 0, 0.08));
    border-radius: 12px;
    margin-bottom: 0.75rem;
  }

  .target-label {
    font-family: var(--font-mono, monospace);
    font-size: 0.62rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--text-muted, #94a3b8);
  }

  .target-pills { display: flex; gap: 0.25rem; }

  .target-btn {
    all: unset;
    cursor: pointer;
    padding: 0.2rem 0.6rem;
    border-radius: 8px;
    font-family: var(--font-sans);
    font-size: 0.68rem;
    font-weight: 500;
    color: var(--text-secondary);
    background: transparent;
    transition: all 0.15s;
  }

  .target-btn.active {
    background: var(--pill-badge-bg, #1a1a24);
    color: var(--pill-badge-text, #ffffff);
    font-weight: 600;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
  }

  .target-cover-tag {
    font-family: var(--font-mono, monospace);
    font-size: 0.68rem;
    font-weight: 600;
    color: var(--text);
  }

  .close-btn {
    all: unset;
    cursor: pointer;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-muted);
    transition: all 0.15s;
  }
  .close-btn:hover { background: var(--pill-bg); color: var(--text); }

  .section-divider {
    height: 1px;
    background: var(--border, rgba(0, 0, 0, 0.08));
    margin: 0.75rem 0;
  }

  /* Seed Area */
  .textarea-wrapper {
    position: relative;
    width: 100%;
  }

  .clear-input-btn {
    all: unset;
    cursor: pointer;
    position: absolute;
    top: 6px;
    right: 8px;
    font-size: 0.65rem;
    color: var(--text-muted);
    width: 18px;
    height: 18px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--pill-bg, rgba(0, 0, 0, 0.06));
    transition: all 0.15s;
  }
  .clear-input-btn:hover {
    background: var(--pill-badge-bg, #1a1a24);
    color: var(--pill-badge-text, #ffffff);
  }

  .seed-textarea {
    width: 100%;
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 0.6rem 1.8rem 0.6rem 0.75rem;
    background: var(--pill-bg);
    color: var(--text);
    font-family: var(--font-sans);
    font-size: 0.76rem;
    resize: none;
    outline: none;
    box-sizing: border-box;
  }
  .seed-textarea:focus { border-color: var(--text); }

  .input-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 0.45rem;
  }

  .delivery-pills { display: flex; gap: 0.25rem; }
  .del-pill {
    all: unset;
    cursor: pointer;
    padding: 0.2rem 0.5rem;
    border-radius: 9999px;
    font-size: 0.62rem;
    color: var(--text-muted);
    background: var(--pill-bg);
    border: 1px solid var(--border);
    transition: all 0.15s;
  }
  .del-pill.active {
    background: var(--pill-badge-bg, #1a1a24);
    color: var(--pill-badge-text, #ffffff);
    border-color: transparent;
    font-weight: 600;
  }

  .seed-btn {
    all: unset;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    padding: 0.3rem 0.75rem;
    background: var(--pill-badge-bg, #1a1a24);
    color: var(--pill-badge-text, #ffffff);
    border-radius: 9999px;
    font-size: 0.7rem;
    font-weight: 600;
    transition: transform 0.15s;
  }
  .seed-btn:hover { transform: scale(1.04); }

  /* Zero State & Wacky Action Grid */
  .action-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.5rem;
  }

  .zero-state-btn {
    all: unset;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.4rem;
    padding: 0.45rem 0.6rem;
    background: var(--pill-badge-bg, #1a1a24);
    color: var(--pill-badge-text, #ffffff);
    border-radius: 12px;
    font-family: var(--font-sans);
    font-size: 0.7rem;
    font-weight: 600;
    box-shadow: 0 4px 12px rgba(0,0,0,0.12);
    transition: all 0.18s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .zero-state-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(0,0,0,0.18);
  }

  .wacky-btn {
    all: unset;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.4rem;
    padding: 0.45rem 0.6rem;
    background: var(--pill-bg);
    border: 1px solid var(--border);
    border-radius: 12px;
    font-family: var(--font-sans);
    font-size: 0.7rem;
    font-weight: 600;
    color: var(--text);
    transition: all 0.18s;
  }
  .wacky-btn:hover {
    background: var(--glass-bg-hover);
    transform: translateY(-1px);
  }

  /* Control Groups */
  .ctrl-group { display: flex; flex-direction: column; gap: 0.4rem; }
  .ctrl-label {
    font-family: var(--font-mono, monospace);
    font-size: 0.6rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--text-muted);
  }

  .preset-pills { display: flex; flex-wrap: wrap; gap: 0.3rem; }
  .preset-btn {
    all: unset;
    cursor: pointer;
    padding: 0.22rem 0.55rem;
    background: var(--pill-bg);
    border: 1px solid var(--border);
    border-radius: 8px;
    font-size: 0.65rem;
    color: var(--text-secondary);
    transition: all 0.15s;
  }
  .preset-btn:hover { background: var(--glass-bg-hover); color: var(--text); }

  .typo-row { display: flex; justify-content: space-between; align-items: center; }
  .font-selector { display: flex; gap: 0.25rem; }
  .font-btn {
    all: unset;
    cursor: pointer;
    padding: 0.22rem 0.55rem;
    border-radius: 6px;
    font-size: 0.68rem;
    color: var(--text-secondary);
    background: var(--pill-bg);
    border: 1px solid var(--border);
  }
  .font-btn.active {
    background: var(--pill-badge-bg, #1a1a24);
    color: var(--pill-badge-text, #ffffff);
  }

  .italic-btn {
    all: unset;
    cursor: pointer;
    width: 26px;
    height: 26px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    font-size: 0.78rem;
    color: var(--text-secondary);
    background: var(--pill-bg);
    border: 1px solid var(--border);
  }
  .italic-btn.active {
    background: var(--pill-badge-bg, #1a1a24);
    color: var(--pill-badge-text, #ffffff);
  }

  .slider-row {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    font-size: 0.68rem;
    color: var(--text-secondary);
  }
  .slider-lbl { width: 42px; font-family: var(--font-mono, monospace); font-size: 0.6rem; }
  .slider-val { width: 36px; text-align: right; font-family: var(--font-mono, monospace); font-size: 0.62rem; color: var(--text-muted); }
  
  .range-slider {
    flex: 1;
    accent-color: var(--text, #1a1a24);
    height: 4px;
  }

  .bottom-bar { display: flex; justify-content: flex-end; }
  .clear-btn {
    all: unset;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.3rem;
    font-size: 0.65rem;
    color: #ef4444;
    padding: 0.2rem 0.4rem;
    border-radius: 6px;
  }
  .clear-btn:hover { background: rgba(239, 68, 68, 0.1); }
</style>
