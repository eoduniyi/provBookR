import everydayProv from './prov.json';
import hyperspecProv from './prov_hyperspec.json';
import hyspcHpcProv from './prov_hyspc_hpc.json';
import { scriptMetadata } from '../scriptData';
import { hyperSpecScriptMetadata } from './scriptData_hyperspec';
import { hySpcHpcScriptMetadata } from './scriptData_hyspc_hpc';

export type ScenarioId = 'everyday' | 'hyperspec' | 'hyspc_hpc';

export interface GuideCaption {
  title: string;
  body: string;
  lookAt?: string;   // optional hint like "Check the left page…"
}

export interface Scenario {
  id: ScenarioId;
  name: string;
  description: string;
  provData: any;
  scriptMetadata: any;
  guide: GuideCaption[];  // indexed by spread number (0 = cover)
}

export const scenarios: Record<ScenarioId, Scenario> = {
  everyday: {
    id: 'everyday',
    name: 'Everyday Provenance',
    description: 'A collection of basic tasks to demonstrate data lineage, like scaling recipes and tracking coffee.',
    provData: everydayProv,
    scriptMetadata: scriptMetadata,
    guide: [
      {
        title: 'Welcome to the Provenance Codex',
        body: 'This cover page shows the script that was executed, the system it ran on, and high-level stats. Think of it as the title page of a research notebook.',
        lookAt: 'Notice the operation & data object counts at the center.'
      },
      {
        title: 'How Provenance Works',
        body: 'Every script follows a flow: raw inputs → operations → output artifacts. The left page explains this pattern; the right page shows the specific scripts available for this scenario.',
        lookAt: 'The numbered flow pills on the left break down the three stages.'
      },
      {
        title: 'The Source Code',
        body: 'Here you can read the actual R script that was recorded. Each highlighted line corresponds to a provenance operation — hover to see what data it produced.',
        lookAt: 'The left page shows the full script; the right page previews the output artifact.'
      },
      {
        title: 'The Lineage Graph',
        body: 'This is the heart of provenance: a directed graph showing how each data entity was created. Circles are data nodes; diamonds are operations.',
        lookAt: 'Follow the arrows from inputs at the top to outputs at the bottom.'
      },
      {
        title: 'Data Lineage & Artifacts',
        body: 'Every entity the script produced is listed here with its type, value, and scope. File outputs include hash checksums for reproducibility.',
        lookAt: 'The left page lists all data entities; the right page shows file artifacts.'
      },
      {
        title: 'Execution Timeline',
        body: 'The final chapter shows the temporal order of operations — which step ran first, how long each took, and the overall elapsed time.',
        lookAt: 'The timeline bar on the left visualizes execution order and duration.'
      }
    ]
  },
  hyperspec: {
    id: 'hyperspec',
    name: 'HyperSpec HPC',
    description: 'Graph-based spatial smoothing for hyperspectral images using a high-performance Rust backend.',
    provData: hyperspecProv,
    scriptMetadata: hyperSpecScriptMetadata,
    guide: [
      {
        title: 'HyperSpec Smoothing Pipeline',
        body: 'This codex traces a hyperspectral image smoothing workflow — from loading raw spectral data to solving a graph-Laplacian system and saving the result.',
        lookAt: 'The cover shows R + Rust as the language stack.'
      },
      {
        title: 'The HPC Pipeline Flow',
        body: 'High-performance computing pipelines follow the same input → process → output pattern, but with FFI boundaries, sparse matrices, and iterative solvers.',
        lookAt: 'The flow pills describe the HPC-specific data pipeline.'
      },
      {
        title: 'R ↔ Rust Source Code',
        body: 'The script calls R functions that dispatch to a Rust backend via extendr. Each function — construct_graph(), build_laplacian(), solve_cg() — crosses the FFI bridge.',
        lookAt: 'Trace the chain: hs_obj → pixel_graph → laplacian → smoothed_hs.'
      },
      {
        title: 'Provenance Graph',
        body: 'The lineage graph reveals the dependency structure: the solver (solve_cg) depends on the Laplacian, which depends on the pixel graph, which depends on the raw data.',
        lookAt: 'This DAG shows how data flows through the FFI pipeline.'
      },
      {
        title: 'Data Artifacts',
        body: 'Each intermediate object — from adjacency parameters to the smoothed output — is tracked with its R type signature and scope.',
        lookAt: 'Notice how function objects (construct_graph, build_laplacian) are also entities.'
      },
      {
        title: 'Execution & Timing',
        body: 'The execution timeline shows the 12-step pipeline from start to finish, with sub-second operation times typical of a Rust-accelerated workflow.',
        lookAt: 'Total elapsed time is under 1 second — that\'s the Rust advantage.'
      }
    ]
  },
  hyspc_hpc: {
    id: 'hyspc_hpc',
    name: 'hySpc.hpc — GSoC 2026',
    description: 'Provenance of 6 commits: iterative CG/BiCGSTAB solver → parallel rayon processing → full FFI, graph, Laplacian & solver test suite.',
    provData: hyspcHpcProv,
    scriptMetadata: hySpcHpcScriptMetadata,
    guide: [
      {
        title: 'GSoC 2026 Commit Provenance',
        body: 'This codex traces 6 git commits from the hySpc.hpc package — from the initial iterative solver implementation to a comprehensive test suite.',
        lookAt: 'The cover shows commit range 589b2b5..62681c3 as the "script".'
      },
      {
        title: 'Building the Kernel',
        body: 'The first commit added CG and BiCGSTAB solvers in Rust. The flow pills describe how each commit builds on the last, layer by layer.',
        lookAt: 'Each commit is a provenance "operation" — code in, files out.'
      },
      {
        title: 'The Commit Source Trail',
        body: 'Instead of a single R script, this codex shows a sequence of commits. Each one touched specific files — lib.rs, graphSmooth.R, Cargo.toml, and test files.',
        lookAt: 'The code view shows the condensed commit log with key snippets.'
      },
      {
        title: 'Commit Dependency Graph',
        body: 'The lineage graph shows how files produced in early commits (lib.rs, extendr-wrappers.R) are consumed by later commits (tests).',
        lookAt: 'Follow the arrows: solver code → parallel processing → test validation.'
      },
      {
        title: 'File Artifacts',
        body: 'Each entity is a source file — Rust crates, R wrappers, and test files. Their values describe the functions and test cases they contain.',
        lookAt: 'test_solvers.R (73 lines) validates the entire pipeline end-to-end.'
      },
      {
        title: 'Development Timeline',
        body: 'The timeline spans July 6 → August 3, 2026 — roughly one month of GSoC work from solver implementation through full test coverage.',
        lookAt: 'Note the burst of 4 test commits on August 3rd.'
      }
    ]
  }
};
