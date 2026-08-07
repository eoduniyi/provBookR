# Source the function directly since we haven't built/installed the package yet
source("R/publish_codex.R")

# Mock system.file to return our local inst/codex_template directory
# instead of checking the installed package path
assignInNamespace("system.file", function(..., package) {
  if (package == "provBookR") {
    return(file.path(getwd(), "inst", "codex_template"))
  } else {
    return(base::system.file(..., package = package))
  }
}, ns="base")

# Run publish_codex on test_script.R
publish_codex(script = "test_script.R", output_dir = "test_booklet")
