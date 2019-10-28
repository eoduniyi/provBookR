# provBookR Architecture
provBookR creates an HTML-based visualizations of the collected provenance from R scripts. The provBookR package does this by utilizing previously developed R provenance tools. In particular, provBookR relies on **RDataTracker** (rdtLite) to **record** provenance generated from scripts in R, **provGraphR** for **querying** the collected provenance, and **provParseR** for **processing** the provenance.

> _The provBookR package makes use of a number of **Data**, **HTML**, and **Provenance** R packages._

```R
# Data packages:
library(DT)
library(gdata)
library(gsubfn)
library(lubridate)
library(tidyverse)

# HTML packages:
library(knitr)
library(htmltools)
library(markdown)
library(shiny)
library(shinyjs)

# Provenance packages:
library(rdtLite) # Load Provenance Collector
library(provGraphR) # Load Provenance Traveler
library(provParseR) # Load Provenance Parser
library(provDebugR) # Load Provenance Debugger
library(provSummarizeR) # Load Provenance Summarizer
```

As a result, provBookR is capable of recording and generating presentations of data provenance from individual R data objects, which users specify through a **browser interface**. The **presentation** done by provBookR is in the form of booklets called **provbooks** - _interactive booklet-like web pages created from R_.

## Systems overview of provBookR
The systems perspective of the provBookR pacakge is as follows:

## Architecture of provbooks
The motivation for provBookR's booklet interface is to produce a document with familiar appears (i.e., books) that contains the data provenance and animation of the data provenance.

## Visualizing data provenance
The animations and visualizations represent the various data manipulations of the respective data objects. In doing so, provBookR affords scientist and programmers a visual aid for understanding and reproducing scientific analyses and results in R.
