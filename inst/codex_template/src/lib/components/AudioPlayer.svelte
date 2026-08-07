<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  const tracks = [
    { label: 'Giant Steps — Coltrane', src: '/audio/Giant-Steps-Coltrane.mp3' },
    { label: 'Rachmaninov PC3 — BBCSSO', src: '/audio/IKM-Rachmaninov-PC3-BBCSSO.mp3' },
    { label: 'Jazz of Physics — TEDx', src: '/audio/The Jazz of Physics  Stephon Alexander  TEDxSanDiego.mp3' },
  ];

  let open = $state(false);
  let currentTrack = $state(0);
  let playing = $state(false);
  let progress = $state(0);
  let duration = $state(0);
  let currentTime = $state(0);

  let audio: HTMLAudioElement;

  function toggle(e: MouseEvent) {
    e.stopPropagation();
    open = !open;
  }

  function selectTrack(index: number) {
    const wasPlaying = playing;
    currentTrack = index;
    audio.src = tracks[index].src;
    audio.load();
    if (wasPlaying) {
      audio.play();
    }
  }

  function togglePlay() {
    if (playing) {
      audio.pause();
    } else {
      audio.play();
    }
  }

  function seek(e: MouseEvent) {
    const bar = e.currentTarget as HTMLElement;
    const rect = bar.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audio.currentTime = ratio * duration;
  }

  function onTimeUpdate() {
    currentTime = audio.currentTime;
    duration = audio.duration || 0;
    progress = duration > 0 ? currentTime / duration : 0;
  }

  function onPlay() { playing = true; }
  function onPause() { playing = false; }
  function onEnded() {
    playing = false;
    // Auto-advance to next track
    if (currentTrack < tracks.length - 1) {
      selectTrack(currentTrack + 1);
      audio.play();
    }
  }

  function fmt(s: number): string {
    if (!isFinite(s) || isNaN(s)) return '0:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  }

  function handleKeydown(e: KeyboardEvent) {
    if (!open) return;
    if (e.key === 'Escape') {
      open = false;
      e.stopPropagation();
    }
  }

  onMount(() => {
    audio = new Audio(tracks[currentTrack].src);
    audio.preload = 'metadata';
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('loadedmetadata', onTimeUpdate);
  });

  onDestroy(() => {
    if (audio) {
      audio.pause();
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('loadedmetadata', onTimeUpdate);
    }
  });
</script>

<svelte:window
  onclick={() => { if (open) open = false; }}
  onkeydown={handleKeydown}
/>

<div class="audio-wrap">
  <button
    class="audio-btn"
    class:active={open || playing}
    onclick={toggle}
    title="Audio Player"
    aria-label="Audio Player"
  >
    {#if playing}
      <span class="mini-eq">
        <span class="b"></span><span class="b"></span><span class="b"></span>
      </span>
    {:else}
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="custom-icon"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>
    {/if}
  </button>

  {#if open}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="panel" onclick={(e: MouseEvent) => e.stopPropagation()}>
      <div class="panel-title">Audio</div>

      <!-- Track list -->
      <div class="track-list">
        {#each tracks as track, i}
          <button
            class="track"
            class:active={currentTrack === i}
            onclick={() => selectTrack(i)}
          >
            <span class="track-indicator">
              {#if currentTrack === i && playing}
                <span class="mini-bars"><span class="b"></span><span class="b"></span><span class="b"></span></span>
              {:else if currentTrack === i}
                ◼
              {:else}
                {i + 1}
              {/if}
            </span>
            <span class="track-label">{track.label}</span>
          </button>
        {/each}
      </div>

      <div class="divider"></div>

      <!-- Transport -->
      <div class="transport">
        <button class="ctrl" onclick={togglePlay} aria-label={playing ? 'Pause' : 'Play'}>
          {playing ? '❚❚' : '▶'}
        </button>

        <span class="time">{fmt(currentTime)}</span>

        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div class="progress-bar" onclick={seek}>
          <div class="progress-fill" style="width:{progress * 100}%"></div>
        </div>

        <span class="time">{fmt(duration)}</span>
      </div>
    </div>
  {/if}
</div>

<style>
  .audio-wrap { position: relative; display: flex; align-items: center; gap: 0.35rem; }

  .audio-btn {
    all: unset;
    cursor: pointer;
    width: 38px;
    height: 38px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-secondary, #4a4a5a);
    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .audio-btn:hover {
    background: rgba(0, 0, 0, 0.06);
    color: var(--text, #1a1a24);
  }
  .audio-btn.active {
    background: #1a1a24;
    color: #ffffff;
    box-shadow: 0 4px 12px rgba(26, 26, 36, 0.3);
  }

  /* Equalizer mini indicator */
  .mini-eq {
    display: flex;
    align-items: flex-end;
    gap: 2px;
    height: 14px;
  }
  .mini-eq .b {
    width: 2px;
    background: currentColor;
    border-radius: 1px;
    animation: eq 0.8s ease-in-out infinite alternate;
  }
  .mini-eq .b:nth-child(1) { height: 30%; animation-delay: 0s; }
  .mini-eq .b:nth-child(2) { height: 80%; animation-delay: 0.2s; }
  .mini-eq .b:nth-child(3) { height: 50%; animation-delay: 0.4s; }

  @keyframes eq {
    0% { height: 20%; }
    100% { height: 90%; }
  }

  /* Panel */
  .panel {
    position: absolute;
    bottom: calc(100% + 8px);
    right: 0;
    background: #fff;
    border: 1px solid var(--border, #e5e7eb);
    border-radius: 8px;
    padding: 1rem 1.1rem;
    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    z-index: 200;
    min-width: 280px;
    max-width: 340px;
  }

  .panel-title {
    font-family: var(--font-sans);
    font-size: 0.65rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--text-muted, #94a3b8);
    margin-bottom: 0.6rem;
  }

  .divider {
    height: 1px;
    background: var(--border, #e5e7eb);
    margin: 0.6rem 0;
  }

  /* Track list */
  .track-list { display: flex; flex-direction: column; gap: 0.2rem; }

  .track {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    padding: 0.35rem 0.5rem;
    border: none;
    border-radius: 4px;
    background: transparent;
    cursor: pointer;
    transition: background 0.12s;
    text-align: left;
    font-family: var(--font-sans);
    font-size: 0.75rem;
    color: var(--text-secondary, #555);
  }
  .track:hover { background: var(--bg-figure, #fafbfc); }
  .track.active {
    background: var(--accent-light, #dbeafe);
    color: var(--accent, #2563eb);
  }

  .track-indicator {
    width: 1.2rem;
    text-align: center;
    font-size: 0.65rem;
    flex-shrink: 0;
    color: var(--text-muted, #94a3b8);
  }
  .track.active .track-indicator { color: var(--accent, #2563eb); }

  .track-label {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .mini-bars { display: inline-flex; align-items: flex-end; gap: 1px; height: 10px; }
  .mini-bars .b {
    width: 1.5px;
    background: var(--accent, #2563eb);
    border-radius: 1px;
    animation: eq 0.8s ease-in-out infinite alternate;
  }
  .mini-bars .b:nth-child(1) { height: 35%; animation-delay: 0s; }
  .mini-bars .b:nth-child(2) { height: 65%; animation-delay: 0.15s; }
  .mini-bars .b:nth-child(3) { height: 45%; animation-delay: 0.3s; }

  /* Transport */
  .transport {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .ctrl {
    font-size: 0.7rem;
    width: 1.8rem;
    height: 1.8rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--border, #e5e7eb);
    border-radius: 50%;
    background: #fff;
    color: var(--text, #1a1a2e);
    cursor: pointer;
    transition: background 0.12s, border-color 0.12s;
    flex-shrink: 0;
  }
  .ctrl:hover {
    background: var(--accent-light, #dbeafe);
    border-color: var(--accent, #2563eb);
  }

  .time {
    font-family: var(--font-mono, monospace);
    font-size: 0.6rem;
    color: var(--text-muted, #94a3b8);
    min-width: 2.5rem;
    text-align: center;
    flex-shrink: 0;
  }

  .progress-bar {
    flex: 1;
    height: 4px;
    background: var(--border, #e5e7eb);
    border-radius: 2px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .progress-fill {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    background: var(--accent, #2563eb);
    border-radius: 2px;
    transition: width 0.15s linear;
  }
</style>
