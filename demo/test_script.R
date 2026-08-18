# test_script.R
# Simple R script to generate provenance

x <- rnorm(100)
y <- x * 2 + rnorm(100, sd=0.5)

# Fit a linear model
model <- lm(y ~ x)

# Print summary
print(summary(model))

# Generate a plot
pdf("scatter_plot.pdf")
plot(x, y, main="Scatter Plot with Regression Line")
abline(model, col="red")
dev.off()

message("Script execution complete!")
