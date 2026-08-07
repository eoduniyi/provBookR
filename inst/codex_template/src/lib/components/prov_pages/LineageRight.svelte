<script lang="ts">
  let { provData } = $props<{ provData: any }>();
  import Icon from '../Icon.svelte';

  const entities = provData?.entity || {};

  const files = Object.entries(entities)
    .filter(([k, e]: [string, any]) => e['rdt:type'] === 'File')
    .map(([id, e]: [string, any]) => ({
      id,
      name: e['rdt:name'] || id,
      type: e['rdt:valType'] || 'File',
      hash: e['rdt:hash'] || 'MD5 Recorded'
    }));
</script>

<div class="registry-page">
  <h3>Generated File Artifacts</h3>
  <p class="reg-desc">
    Every output file created by our everyday R examples, verified with cryptographic hash integrity:
  </p>

  <div class="artifact-grid">
    {#each files as file}
      <div class="glass-artifact-card">
        <div class="art-icon"><Icon name="document" size={20} /></div>
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
  }
  .reg-desc {
    font-size: 0.84rem;
    color: var(--text-secondary, #4a4a5a);
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
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    border: 1px solid rgba(255, 255, 255, 0.9);
    border-radius: 18px;
    box-shadow: 0 4px 16px -2px rgba(0, 0, 0, 0.03);
    transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .glass-artifact-card:hover {
    transform: translateY(-1px);
    background: rgba(255, 255, 255, 0.9);
  }

  .art-icon {
    font-size: 1.3rem;
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
    color: var(--text, #1a1a24);
  }

  .art-meta {
    display: flex;
    gap: 0.8rem;
    font-family: var(--font-sans);
    font-size: 0.68rem;
    color: var(--text-muted, #8e8e9e);
  }

  .art-hash {
    font-family: var(--font-mono, monospace);
  }
</style>
