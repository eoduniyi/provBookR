#' Publish a Provenance Codex
#'
#' Executes an R script, collects its provenance using \code{rdtLite}, and 
#' generates a static SvelteKit digital booklet.
#'
#' @param script The path to the R script to execute.
#' @param output_dir The directory where the static HTML booklet will be generated.
#' @export
publish_codex <- function(script, output_dir = "codex_build") {
  if (!requireNamespace("rdtLite", quietly = TRUE)) {
    stop("Package 'rdtLite' must be installed to use publish_codex().")
  }
  
  if (!file.exists(script)) {
    stop("Script not found: ", script)
  }
  
  # Step 1: Run the script and collect provenance
  message("Executing script and collecting provenance...")
  rdtLite::prov.run(script)
  
  json_path <- file.path("prov_data", "prov.json")
  if (!file.exists(json_path)) {
    json_path <- list.files(path = ".", pattern = "^prov.*\\.json$", recursive = TRUE, full.names = TRUE)[1]
  }
  
  if (is.null(json_path) || is.na(json_path) || !file.exists(json_path)) {
    stop("Failed to generate provenance JSON.")
  }
  prov_json <- paste(readLines(json_path, warn = FALSE), collapse = "\n")
  
  # Step 2: Scaffold the codex template
  template_dir <- system.file("codex_template", package = "provBookR")
  if (template_dir == "") {
    stop("Codex template not found in package installation.")
  }
  
  # Create a temporary workspace for the build
  build_ws <- tempfile(pattern = "codex_ws_")
  dir.create(build_ws)
  
  message("Scaffolding SvelteKit codex...")
  files_to_copy <- list.files(template_dir, full.names = TRUE, all.files = TRUE, no.. = TRUE)
  files_to_copy <- files_to_copy[!basename(files_to_copy) %in% c("node_modules", ".svelte-kit", "build")]
  
  file.copy(from = files_to_copy,
            to = build_ws,
            recursive = TRUE,
            copy.mode = TRUE)
  
  # Step 3: Inject the provenance data
  data_dir <- file.path(build_ws, "src", "lib", "data")
  dir.create(data_dir, recursive = TRUE, showWarnings = FALSE)
  writeLines(prov_json, file.path(data_dir, "prov.json"))
  
  # Step 4: Build the static site
  message("Building static booklet (this requires Node.js)...")
  old_wd <- setwd(build_ws)
  on.exit(setwd(old_wd))
  
  # Use npm install and build
  sys_res_install <- system2("npm", args = c("install"))
  if (sys_res_install != 0) {
    stop("npm install failed. Ensure Node.js and npm are installed.")
  }
  
  sys_res_build <- system2("npm", args = c("run", "build"))
  if (sys_res_build != 0) {
    stop("npm run build failed.")
  }
  
  # Step 5: Copy the final build to the output_dir
  setwd(old_wd)
  if (!dir.exists(output_dir)) {
    dir.create(output_dir, recursive = TRUE)
  }
  
  message(sprintf("Copying build to %s...", output_dir))
  build_output <- file.path(build_ws, "build")
  file.copy(from = list.files(build_output, full.names = TRUE),
            to = output_dir,
            recursive = TRUE)
  
  message("Codex successfully published at: ", file.path(output_dir, "index.html"))
  return(TRUE)
}
