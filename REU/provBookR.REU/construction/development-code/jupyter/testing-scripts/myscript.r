# Set to the directory of provBookR
setwd("/Users/erickoduniyi/Documents/School/KU/Academics/2018-2019/Research/Hardvard-Forest/Projects/Fruits-Of-Provenance/Construction/Development-Code/provBookR/provBookR")

# Load Provenance Collector (Recorder)
library(rdtLite)

# Load Provenance Parser
library(provParseR)

# Load Provenance Debugger
library(provDebugR)

# Load Provenance Summarizer
library(provSummarizeR)

# Create a basic function
f <- function(x){
	y <- x^2
	return(y)
}
a <- 10
b <- f(a)
