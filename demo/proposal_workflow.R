# proposal_workflow.R
# A simple, everyday example of drafting a proposal and generating a final PDF

# 1. Simulate drafting the proposal content
draft_v1 <- "Introduction: This is the first draft of the HF 2019 REU Proposal."
draft_v2 <- paste(draft_v1, "Methodology: We will use a mixed-methods approach.")

# 2. Assign reviewers and gather feedback
reviewer_1 <- "Dr. Smith"
reviewer_2 <- "Dr. Jones"
feedback <- c(reviewer_1 = "Needs more background context", reviewer_2 = "Methodology looks solid")

# 3. Incorporate feedback into the final text
final_text <- paste(
  draft_v2, 
  "\\n\\nReviewer Notes:", 
  paste(feedback, collapse = " | ")
)

# 4. Output the final proposal as a PDF
# This simulates "trading" or distributing the final artifact
pdf("HF_2019_REU_PROPOSAL.pdf", width = 8, height = 11)
plot.new()
text(x = 0.5, y = 0.8, labels = "HF 2019 REU PROPOSAL", cex = 2, font = 2)
text(x = 0.5, y = 0.5, labels = final_text, cex = 1, wrap = TRUE)
text(x = 0.5, y = 0.2, labels = "Status: FINAL", col = "red")
dev.off()

print("Proposal HF_2019_REU_PROPOSAL.pdf has been generated successfully!")
