<script lang="ts">
  let { provData } = $props<{ provData: any }>();

  const examples = [
    {
      title: "1. Proposal Workflow",
      script: "proposal_workflow.R",
      input: "draft_v1, feedback",
      logic: "paste() text merging",
      output: "HF_2019_REU_PROPOSAL.pdf"
    },
    {
      title: "2. Weekly Coffee Tracker",
      script: "coffee_tracker.R",
      input: "daily_cups vector, $4.50 rate",
      logic: "sum() * price",
      output: "coffee_summary.csv"
    },
    {
      title: "3. Weather Analysis",
      script: "weather_analysis.R",
      input: "weekly temps vector",
      logic: "mean() & temp > avg filter",
      output: "weather_chart.pdf"
    },
    {
      title: "4. Recipe Scaling",
      script: "recipe_scaling.R",
      input: "cookie ingredients data frame",
      logic: "amt * scale_factor (3x)",
      output: "party_recipe.csv"
    },
    {
      title: "5. Student Grading",
      script: "student_grades.R",
      input: "student names & scores",
      logic: "ifelse() grade assignment",
      output: "class_avg & letter grades"
    }
  ];

  let selectedEx = $state(0);
</script>

<div class="intro-right">
  <h3>5 Everyday Examples</h3>
  <p class="ex-desc">Click an example to see its inputs, processing logic, and final artifact:</p>

  <div class="ex-list">
    {#each examples as ex, idx}
      <!-- Liquid Glass Pill Card -->
      <button 
        class="glass-ex-card" 
        class:active={selectedEx === idx}
        onclick={() => selectedEx = idx}
      >
        <div class="card-head">
          <span class="ex-title">{ex.title}</span>
          <code class="ex-script">{ex.script}</code>
        </div>
        <div class="card-flow">
          <span class="flow-tag input-tag">{ex.input}</span>
          <span class="flow-arrow">→</span>
          <span class="flow-tag logic-tag">{ex.logic}</span>
          <span class="flow-arrow">→</span>
          <span class="flow-tag out-tag">{ex.output}</span>
        </div>
      </button>
    {/each}
  </div>
</div>

<style>
  .intro-right {
    display: flex;
    flex-direction: column;
  }
  .intro-right h3 {
    margin-top: 0;
    color: var(--text);
  }
  .ex-desc {
    font-size: 0.78rem;
    color: var(--text-secondary);
    margin-bottom: 0.5rem;
  }

  .ex-list {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
  }

  /* Liquid Glass Pill Card */
  .glass-ex-card {
    all: unset;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    padding: 0.45rem 0.75rem;
    background: var(--glass-bg);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    border: 1px solid var(--glass-border);
    border-radius: 14px;
    box-shadow: var(--glass-shadow);
    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .glass-ex-card:hover {
    transform: translateY(-1px);
    background: var(--glass-bg-hover);
  }

  .glass-ex-card.active {
    background: var(--card-bg-active);
    border-color: var(--card-border-active);
    box-shadow: 0 4px 16px -2px rgba(0, 0, 0, 0.12), inset 0 1px 1px rgba(255, 255, 255, 0.4);
  }

  .card-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .ex-title {
    font-family: var(--font-sans);
    font-size: 0.76rem;
    font-weight: 600;
    color: var(--text);
  }

  .ex-script {
    font-family: var(--font-mono, monospace);
    font-size: 0.64rem;
    color: var(--text-muted);
  }

  .card-flow {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    flex-wrap: wrap;
    font-family: var(--font-mono, monospace);
    font-size: 0.64rem;
  }

  .flow-tag {
    padding: 0.1rem 0.45rem;
    border-radius: 9999px;
    background: var(--pill-bg);
    color: var(--pill-text);
    border: 1px solid var(--border);
  }

  .out-tag {
    font-weight: 600;
    background: var(--card-bg-hover);
    color: var(--text);
    border-color: var(--border);
  }

  .flow-arrow {
    color: var(--text-muted);
    font-size: 0.65rem;
  }
</style>
