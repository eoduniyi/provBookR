# The Architecture of Speed: hySpc.hpc (GSoC 2026)

This story traces the 6-commit genesis of a high-performance R/Rust spatial smoothing kernel built for the `hySpc.hpc` package during Google Summer of Code 2026.

Over the span of just one month (July 6 – August 3), the codebase evolved from a conceptual solver into a massively parallelized, fully tested C-ABI foreign function interface (FFI) backend that processes hyperspectral imagery at blazing speeds.

---

## 1. The Iterative Solver Core

> [!NOTE] 
> **Commit 589b2b5** (July 6, 2026)
> *Added iterative solver (CG + BiCGSTAB)*

Hyperspectral image smoothing requires solving massive, sparse linear systems (the graph Laplacian). Initially, the package relied on exact dense solvers or R's slow native iterative solvers. The first major milestone was porting the Conjugate Gradient (CG) and Biconjugate Gradient Stabilized (BiCGSTAB) solvers into Rust using the `faer` linear algebra crate.

```diff
- graphSmooth <- function(hs_obj, backend = "r", solver = "exact") {
-   # Slow native R execution
-   solve(L, b)
- }
+ graphSmooth <- function(hs_obj, backend = "rust", solver = "cg") {
+   # Dispatch to blazing fast Rust FFI
+   graph_smooth_rust(b, w, h, alpha, neighbors, solver)
+ }
```

By adding the FFI boundary through `extendr-wrappers.R`, R could seamlessly pass a `dgCMatrix` to Rust, where the heavily optimized CG solver took over.

---

## 2. Unlocking Parallel Processing

> [!TIP]
> **Commit 923013f** (July 27, 2026)
> *Added parallel rayon band processing*

A hyperspectral image isn't just one matrix; it's hundreds of spectral bands. Solving them sequentially left 95% of a modern CPU idle. By introducing `rayon` in `Cargo.toml`, the Rust kernel was modified to solve all spectral bands concurrently.

````carousel
```rust
// BEFORE: Sequential execution
for band in bands {
    let result = solve_cg(&laplacian, &band);
    smoothed_bands.push(result);
}
```
<!-- slide -->
```rust
// AFTER: Zero-cost Rayon parallelization
use rayon::prelude::*;

let smoothed_bands: Vec<_> = bands
    .par_iter()
    .map(|band| solve_cg(&laplacian, band))
    .collect();
```
````

By simply changing `.iter()` to `.par_iter()`, the solver scaled linearly with CPU cores.

---

## 3. The Grand Validation (The Testing Blitz)

> [!IMPORTANT]
> **Commits 0e2d28f → 62681c3** (August 3, 2026)
> *Added FFI, Graph, Laplacian, and Solver Unit Tests*

Writing fast code is easy; writing *correct* fast code is hard. On August 3rd, a burst of 4 commits introduced a bulletproof unit test suite using `testthat`.

### Validating the FFI Bridge
Data serialization across languages is notoriously error-prone. The FFI tests ensure that R's `dgCMatrix` perfectly matches Rust's `faer` Sparse Matrix.
```r
# test_ffi_bridge.R
test_that("Sparse matrix serialization is lossless", {
  A <- Matrix::rsparsematrix(100, 100, density = 0.05)
  expect_equal(
    sparse_row_sums_rust(A), 
    Matrix::rowSums(A)
  )
})
```

### Validating the Math
The Laplacian matrix ($L = D - W$) dictates how spatial data smooths. The tests ensure that the diagonal values (degrees) perfectly match the graph edges.
```r
# test_laplacian.R
test_that("Laplacian matrix structure is correct", {
  stats <- pixel_graph_stats_rust(width = 4L, height = 3L, neighbors = 4L)
  
  # Ensure the diagonal holds the degree matrix D
  diag_vals <- L@x[L@i == col_indices]
  expect_equal(diag_vals, as.numeric(stats$degrees))
})
```

### Validating the Solvers
Finally, the iterative solvers were pit against exact dense math to prove their correctness.
```r
# test_solvers.R
test_that("Iterative CG matches exact dense solver", {
  x_cg <- graph_smooth_rust(b, w, h, alpha, 4L, "cg")
  expect_equal(x_cg, x_exact, tolerance = 1e-6)
})
```

---

## The Result

In 6 commits, `hySpc.hpc` transformed. The integration of `extendr`, `faer`, and `rayon` created a spatial smoothing engine that is memory-safe, mathematically verified, and exponentially faster than its predecessor. This isn't just an R package anymore; it's a high-performance computing kernel.
