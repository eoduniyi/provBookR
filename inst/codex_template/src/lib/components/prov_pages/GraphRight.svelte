<script lang="ts">
  let { provData } = $props<{ provData: any }>();
  import { activeScriptState } from '../../state.svelte';

  let selectedNode = $state<{ id: string; name: string; type: string; detail: string } | null>(null);

  const activities = provData?.activity || {};
  const entities = provData?.entity || {};
  const usedRels = provData?.used || {};
  const genRels = provData?.wasGeneratedBy || {};

  const scriptToNum: Record<string, number> = {
    "proposal_workflow.R": 1,
    "coffee_tracker.R": 2,
    "weather_analysis.R": 3,
    "recipe_scaling.R": 4,
    "student_grades.R": 5
  };

  const activeNum = $derived(scriptToNum[activeScriptState.currentId] || 1);

  const graphData = $derived.by(() => {
    // 1. Filter activities to active script
    const actKeys = Object.keys(activities).filter(k => 
      activities[k]['rdt:type'] === 'Operation' && activities[k]['rdt:scriptNum'] === activeNum
    );
    const scriptActSet = new Set(actKeys);

    // 2. Find related entities
    const relatedEntityIds = new Set<string>();
    Object.values(usedRels).forEach((u: any) => {
      if (scriptActSet.has(u['prov:activity'])) relatedEntityIds.add(u['prov:entity']);
    });
    Object.values(genRels).forEach((g: any) => {
      if (scriptActSet.has(g['prov:activity'])) relatedEntityIds.add(g['prov:entity']);
    });

    const entKeys = Array.from(relatedEntityIds).filter(k => 
      k.startsWith('rdt:d') && entities[k]?.['rdt:type'] !== 'Environment'
    );

    // 3. Build Nodes
    const PAD = 44;
    const SPACING_X = 76;
    const ACT_Y = 65;
    const ENT_Y = 195;
    const totalWidth = PAD * 2 + Math.max(actKeys.length, entKeys.length) * SPACING_X;
    const viewW = Math.max(totalWidth, 500);

    type GNode = { id: string; label: string; type: 'act' | 'ent'; x: number; y: number; detail: string; isFile: boolean };
    const nodes: GNode[] = [];
    const nodeMap = new Map<string, GNode>();

    actKeys.forEach((k, i) => {
      const a = activities[k];
      const rawName = a['rdt:name'] || k;
      const label = rawName.length > 22 ? rawName.slice(0, 20) + '…' : rawName;
      const n: GNode = { id: k, label, type: 'act', x: PAD + i * SPACING_X, y: ACT_Y + (i % 2) * 26, detail: rawName, isFile: false };
      nodes.push(n);
      nodeMap.set(k, n);
    });

    entKeys.forEach((k, i) => {
      const e = entities[k];
      const name = e['rdt:name'] || k;
      const label = name.length > 14 ? name.slice(0, 12) + '…' : name;
      const isFile = e['rdt:type'] === 'File';
      const detail = `${name} = ${e['rdt:value'] || '?'}`;
      const n: GNode = { id: k, label, type: 'ent', x: PAD + i * SPACING_X, y: ENT_Y + (i % 2) * 26, detail, isFile };
      nodes.push(n);
      nodeMap.set(k, n);
    });

    // 4. Build Edges (only keeping edges within the active graph)
    type GEdge = { from: GNode; to: GNode; kind: 'used' | 'generated' };
    const edges: GEdge[] = [];

    Object.values(usedRels).forEach((u: any) => {
      const ent = nodeMap.get(u['prov:entity']);
      const act = nodeMap.get(u['prov:activity']);
      if (ent && act) edges.push({ from: ent, to: act, kind: 'used' });
    });

    Object.values(genRels).forEach((g: any) => {
      const act = nodeMap.get(g['prov:activity']);
      const ent = nodeMap.get(g['prov:entity']);
      if (act && ent) edges.push({ from: act, to: ent, kind: 'generated' });
    });

    return { nodes, edges, viewW };
  });

  function edgePath(e: any): string {
    const dx = (e.to.x - e.from.x) * 0.45;
    return `M ${e.from.x} ${e.from.y} C ${e.from.x + dx} ${e.from.y + 35}, ${e.to.x - dx} ${e.to.y - 35}, ${e.to.x} ${e.to.y}`;
  }

  function selectNode(n: any) {
    selectedNode = { id: n.id, name: n.label, type: n.type === 'act' ? 'Operation' : 'Entity', detail: n.detail };
  }
</script>

<div class="graph-page">
  <div class="eink-canvas-container">
    <svg viewBox="0 0 {graphData.viewW} 270" preserveAspectRatio="xMidYMid meet">
      <defs>
        <marker id="arr-u" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="5" markerHeight="5" orient="auto">
          <path d="M0,0 L8,4 L0,8 Z" fill="#71717a" />
        </marker>
        <marker id="arr-g" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="5" markerHeight="5" orient="auto">
          <path d="M0,0 L8,4 L0,8 Z" fill="#18181b" />
        </marker>
      </defs>

      <!-- Edges -->
      {#each graphData.edges as e}
        <path
          d={edgePath(e)}
          fill="none"
          stroke={e.kind === 'used' ? 'var(--text-muted)' : 'var(--text)'}
          stroke-width="1.3"
          stroke-dasharray={e.kind === 'used' ? '4 3' : 'none'}
          marker-end={e.kind === 'used' ? 'url(#arr-u)' : 'url(#arr-g)'}
          opacity="0.6"
        />
      {/each}

      <!-- Nodes -->
      {#each graphData.nodes as n}
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <g
          class="node"
          transform="translate({n.x},{n.y})"
          onclick={() => selectNode(n)}
          onkeydown={(ev) => ev.key === 'Enter' && selectNode(n)}
          role="button"
          tabindex="0"
        >
          {#if n.type === 'act'}
            <!-- Operation Node -->
            <rect x="-30" y="-14" width="60" height="28" rx="8"
              fill="var(--bg)" stroke="var(--border)" stroke-width="1.2"
              class="node-shape" />
            <text y="4" text-anchor="middle"
              font-family="var(--font-mono, monospace)" font-size="7.5" fill="var(--text)" font-weight="500">
              {n.label.length > 10 ? n.label.slice(0, 9) + '…' : n.label}
            </text>
          {:else}
            <!-- Entity Node (Liquid Bubble Circle) -->
            <circle r="16"
              fill={n.isFile ? 'var(--bg-warm)' : 'var(--bg)'}
              stroke={n.isFile ? 'var(--text-muted)' : 'var(--border)'}
              stroke-width="1.3"
              class="node-shape" />
            <text y="3.5" text-anchor="middle"
              font-family="var(--font-mono, monospace)" font-size="7.5"
              fill="var(--text)" font-weight="600">
              {n.label.length > 8 ? n.label.slice(0, 7) + '…' : n.label}
            </text>
          {/if}
        </g>
      {/each}
    </svg>
  </div>

  <!-- Legend Pills -->
  <div class="legend-bar">
    <span class="legend-pill"><span class="leg-rect"></span> Operation</span>
    <span class="legend-pill"><span class="leg-circle"></span> Data Entity</span>
    <span class="legend-pill"><span class="leg-dash"></span> used</span>
    <span class="legend-pill"><span class="leg-solid"></span> generated</span>
  </div>

  <!-- Liquid Glass Bubble Inspector -->
  {#if selectedNode}
    <div class="glass-inspector">
      <div class="insp-header">
        <span class="insp-type">{selectedNode.type}</span>
        <button class="insp-close" onclick={() => selectedNode = null}>✕</button>
      </div>
      <code class="insp-detail">{selectedNode.detail}</code>
    </div>
  {/if}
</div>

<style>
  .graph-page {
    display: flex;
    flex-direction: column;
    height: 100%;
    gap: 0.6rem;
  }

  .eink-canvas-container {
    flex: 1;
    background: #ffffff;
    border: 1px solid rgba(0, 0, 0, 0.08);
    border-radius: 20px;
    overflow: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.03);
  }

  .eink-canvas-container svg {
    width: 100%;
    height: auto;
    min-height: 200px;
  }

  .node {
    cursor: pointer;
    transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .node:hover {
    transform: scale(1.06);
  }

  .node-shape {
    transition: stroke 0.2s, stroke-width 0.2s;
  }

  .node:hover .node-shape {
    stroke: #18181b;
    stroke-width: 1.8;
  }

  /* Legend Pills */
  .legend-bar {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    justify-content: center;
    padding: 0.2rem 0;
  }

  .legend-pill {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.3rem 0.75rem;
    background: rgba(255, 255, 255, 0.65);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(0, 0, 0, 0.06);
    border-radius: 9999px;
    font-family: var(--font-sans);
    font-size: 0.68rem;
    color: var(--text-muted, #8e8e9e);
  }

  .leg-rect {
    display: inline-block;
    width: 12px; height: 8px;
    border: 1px solid #d4d4d8;
    border-radius: 2px;
    background: #ffffff;
  }

  .leg-circle {
    display: inline-block;
    width: 9px; height: 9px;
    border-radius: 50%;
    background: #ffffff;
    border: 1px solid #a1a1aa;
  }

  .leg-dash {
    display: inline-block;
    width: 14px; height: 0;
    border-top: 1.5px dashed #a1a1aa;
  }

  .leg-solid {
    display: inline-block;
    width: 14px; height: 0;
    border-top: 1.5px solid #27272a;
  }

  /* Liquid Glass Inspector Bubble */
  .glass-inspector {
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid rgba(255, 255, 255, 0.95);
    border-radius: 20px;
    padding: 0.75rem 1.1rem;
    box-shadow: 0 8px 32px -4px rgba(0, 0, 0, 0.05), inset 0 1px 1px rgba(255, 255, 255, 1);
  }

  .insp-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.25rem;
  }

  .insp-type {
    font-family: var(--font-sans);
    font-size: 0.62rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--text-muted, #8e8e9e);
    font-weight: 600;
  }

  .insp-close {
    all: unset;
    cursor: pointer;
    font-size: 0.75rem;
    color: var(--text-muted);
    padding: 0.1rem 0.3rem;
  }
  .insp-close:hover { color: var(--text); }

  .insp-detail {
    font-family: var(--font-mono, monospace);
    font-size: 0.78rem;
    color: var(--text, #1a1a24);
    word-break: break-word;
    font-weight: 500;
  }
</style>
