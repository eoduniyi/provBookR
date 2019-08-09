# Set to the directory of provBookR
# setwd()

# Load provenance Collector (Recorder)
library(rdtLite)

# Load provenance Parser
library(provParseR)

# Load provenance Debugger
library(provDebugR)

# Load provenance Summarizer
library(provSummarizeR)

# Load the provenance Traveler
library(provGraphR)

# Set the .R file which the provenance is to be collected over
testing.script <- "testing-scripts/myscript-data-frame-2-5by5MAT.r"

# Collect the provenance specifying the maximum snapshot size
prov.run(testing.script, prov.dir=".", overwrite=FALSE, snapshot.size = Inf)

# Collect the generated provenance
# file.name <- "path/to/file/prov.json"

# Collect the name of the node.id
get.variable.named(file.name,"my.data.frame")