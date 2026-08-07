hs_obj <- "hyperspectral_data_mock"
adj_params <- list(k = 5, method = "knn")

construct_graph <- function(obj, params) { return("pixel_graph_mock") }
pixel_graph <- construct_graph(hs_obj, adj_params)

build_laplacian <- function(graph) { return("laplacian_matrix_mock") }
laplacian <- build_laplacian(pixel_graph)

solve_cg <- function(L, obj, a) { return("smoothed_hyperspec_mock") }
alpha <- 0.1
smoothed_hs <- solve_cg(laplacian, hs_obj, alpha)

saveRDS(smoothed_hs, "smoothed_hyperspec.rds")
