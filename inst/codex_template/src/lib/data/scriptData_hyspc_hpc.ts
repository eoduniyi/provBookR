import type { ScriptMeta } from '../scriptData';

export const hySpcHpcScriptMetadata: Record<string, ScriptMeta> = {
  "hySpc.hpc commits 589b2b5..62681c3": {
    id: "hySpc.hpc commits 589b2b5..62681c3",
    name: "hySpc.hpc — GSoC 2026",
    category: 'HPC & Systems',
    icon: "code",
    goal: "Build a high-performance R/Rust graph-smoothing kernel for hyperspectral images — from iterative CG/BiCGSTAB solver to parallel rayon processing and a complete test suite.",
    variables: [
      "lib.rs (solver core)",
      "graphSmooth.R",
      "extendr-wrappers.R",
      "Cargo.toml (rayon)",
      "test_ffi_bridge.R",
      "test_graph_construction.R",
      "test_laplacian.R",
      "test_solvers.R"
    ],
    operations: [
      "[589b2b5] add iterative solver (CG + BiCGSTAB)",
      "[923013f] add parallel rayon band processing",
      "[0e2d28f] add FFI bridge unit tests",
      "[3d252fe] add adjacency graph unit tests",
      "[2433571] add Laplacian matrix unit tests",
      "[62681c3] add solver unit tests"
    ],
    outputFile: "tests/testthat/test_solvers.R",
    code: `# hySpc.hpc — iterative solver for graph-based spatial smoothing
# Commit: 589b2b5  (2026-07-06)
# Files:  src/rust/src/lib.rs, R/graphSmooth.R, R/extendr-wrappers.R

# R entry point — dispatches to Rust backend by default
graphSmooth(hs_obj, width = 64L, height = 64L,
            alpha = 0.1, neighbors = 4L,
            backend = "rust", solver = "cg")

# Commit: 923013f  (2026-07-27)
# Added rayon parallel processing to Rust kernel
# Each spectral band solved independently via par_iter()

# Commit: 0e2d28f  (2026-08-03)
# test_ffi_bridge.R — validates dgCMatrix -> faer round-trip
expect_equal(sparse_row_sums(A), Matrix::rowSums(A))

# Commit: 3d252fe  (2026-08-03)
# test_graph_construction.R — 4/8-connectivity edge & degree checks
stats <- pixel_graph_stats_rust(4L, 3L, 4L)
expect_equal(stats$nodes, 12L)

# Commit: 2433571  (2026-08-03)
# test_laplacian.R — L = D - W structural properties
diag_vals <- L@x[L@i == col_indices]
expect_equal(diag_vals, as.numeric(stats$degrees))

# Commit: 62681c3  (2026-08-03)
# test_solvers.R — CG and BiCGSTAB agree with exact dense solve
x_cg <- graph_smooth_rust(b, w, h, alpha, 4L, "cg")
expect_equal(x_cg, x_exact, tolerance = 1e-6)`
  }
};
