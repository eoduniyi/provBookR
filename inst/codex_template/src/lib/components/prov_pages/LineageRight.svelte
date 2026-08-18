<script lang="ts">
  let { provData } = $props<{ provData: any }>();
  import Icon from '../Icon.svelte';

  const entities = $derived(provData?.entity || {});

  const files = $derived(
    Object.entries(entities)
      .filter(([k, e]: [string, any]) => e['rdt:type'] === 'File')
      .map(([id, e]: [string, any]) => ({
        id,
        name: e['rdt:name'] || id,
        type: e['rdt:valType'] || 'File',
        hash: e['rdt:hash'] || 'MD5 Recorded'
      }))
  );
</script>

<div class="registry-page">
  <h3>Generated File Artifacts</h3>
  <p class="reg-desc">
    Output files created by computational execution, verified with cryptographic hash integrity:
  </p>

  <div class="artifact-grid">
    {#each files as file}
      <div class="glass-artifact-card">
        <div class="art-icon"><Icon name="file-output" size={20} /></div>
        <div class="art-details">
          <span class="art-name">{file.name}</span>
          <div class="art-meta">
            <span class="art-type">{file.type}</span>
            <span class="art-hash">MD5: {file.hash}</span>
          </div>
        </div>
      </div>
    {/each}
  </div>

  <div class="note">
    <strong>Artifact Provenance:</strong> These files are the final output of the derivation graph. Each file carries its origin history and hash proof.
  </div>
</div>

<style>
  .registry-page {
    min-height: 100%;
    display: flex;
    flex-direction: column;
  }
  .registry-page h3 {
    margin-top: 0;
    color: var(--text);
  }
  .reg-desc {
    font-size: 0.84rem;
    color: var(--text-secondary);
    margin-bottom: 1.2rem;
  }

  .artifact-grid {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
    margin-bottom: 1.5rem;
  }

  /* Liquid Glass Artifact Card */
  .glass-artifact-card {
    display: flex;
    align-items: center;
    gap: 0.9rem;
    padding: 0.8rem 1.1rem;
    background: var(--glass-bg);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    border: 1px solid var(--glass-border);
    border-radius: 18px;
    box-shadow: var(--glass-shadow);
    transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), background 0.2s;
  }

  .glass-artifact-card:hover {
    transform: translateY(-1px);
    background: var(--glass-bg-hover);
  }

  .art-icon {
    color: var(--text);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .art-details {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
    min-width: 0;
  }

  .art-name {
    font-family: var(--font-mono, monospace);
    font-size: 0.82rem;
    font-weight: 600;
    color: var(--text);
  }

  .art-meta {
    display: flex;
    gap: 0.8rem;
    font-family: var(--font-sans);
    font-size: 0.68rem;
    color: var(--text-muted);
  }

  .art-hash {
    font-family: var(--font-mono, monospace);
  }
</style>
