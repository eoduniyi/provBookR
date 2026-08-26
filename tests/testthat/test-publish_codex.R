test_that("publish_codex throws error for missing script", {
  expect_error(
    publish_codex("non_existent_fake_script.R"),
    "Script not found"
  )
})
