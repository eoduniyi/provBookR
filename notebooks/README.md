# provBookR Showcase Notebooks

This directory contains showcase notebooks demonstrating practical, real-world workflows using `provBookR` to collect, visualize, and publish computational provenance.

## 📚 Showcase Catalog

| Notebook & Script | Domain & Workflow | Key Provenance Features Showcase |
| :--- | :--- | :--- |
| **[`01_everyday_data_pipeline.ipynb`](01_everyday_data_pipeline.ipynb)** / [`01_everyday_data_pipeline.R`](01_everyday_data_pipeline.R) | Everyday Data Science & Visualization | Ingestion, filtering, summary stats, ggplot rendering, and variable derivation tracking. |
| **[`02_hpc_development_story.ipynb`](02_hpc_development_story.ipynb)** / [`02_hpc_development_story.R`](02_hpc_development_story.R) | HPC & High-Performance Computing | Iterative benchmarking, memory allocation, sub-second step execution timing, and performance stories. |
| **[`03_reproducible_proposal_workflow.ipynb`](03_reproducible_proposal_workflow.ipynb)** / [`03_reproducible_proposal_workflow.R`](03_reproducible_proposal_workflow.R) | Collaborative Research & Publishing | Multi-reviewer feedback integration, document drafting, MD5 hash verification, and PDF artifact compilation. |

---

## 🚀 How to Run & Publish Any Notebook

To generate an interactive `provBook` from any of these notebooks, execute the following commands in R:

```R
library(provBookR)

# Publish the Everyday Data Science notebook into a web booklet:
publish_codex("notebooks/01_everyday_data_pipeline.R", output_dir = "books/everyday_data_pipeline")

# Publish the HPC Performance Story notebook:
publish_codex("notebooks/02_hpc_development_story.R", output_dir = "books/hpc_development_story")

# Publish the Collaborative Proposal Workflow notebook:
publish_codex("notebooks/03_reproducible_proposal_workflow.R", output_dir = "books/proposal_workflow")
```

Each command generates a static, standalone web booklet in `books/<notebook_name>/index.html` that can be viewed locally or deployed to GitHub Pages!
