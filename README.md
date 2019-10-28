# [provBookR](provBookR.architecture.md)
> Creates an HTML-based visualization of provenance

## Nature of provenance
How scientific results come to be is the product of various domain-specifc, economic, historical, social, and technical factors. As a consequence, information about how these factors shaped and produced these results is essential to both artistic trade and scientific reproducibility. Whether these results are material or digital, **provenance** provides the historical accounts of objects: paintings, bones, essays, scientific tables, and plots.

## Visualizing data stories
Using the idea of provenance and associated **End-to-end-provenance** tools that collect provenance, we develop an R package that presents visualizations of provenance for R scripts. This tool is called **provBookR**, and it allows users to get and visualize the history of single R data objects (e.g., plots, scientific tables, variables).

# Installation
Install from GitHub:
```R
# install.packages("devtools")
devtools::install_github("End-to-end-provenance/provBookR")

```
Once installed, load the package:
```R
library(provBookR)
```

# [Usage](provBookR.usage.md)
> The provBookR package uses a **browser interface** for the generation of **provbooks** and specification of **provenance operations**. The browser has two interface modes: **lite** and **full**. The lite mode is intended for quick generation of provbooks, while the full mode is intended to support the exploration of the collected provenance.

1. To quickly generate a provebook from the already collected provenance:
```R
# Run provBookR with lite option specified
> provBookR("prov.json", mode="lite")
```
```
variable name?:
provBookR.lite> f
Running provBookR lite for "f" from prov.json...
[1] "f <- function(x) {\ty <- x^2\treturn(y)}"
[2] "f"                                       
Generate a provbook for this object history? (Y/N):
provBookR> Y
Done!
provbook for variable "f" is stored in /path/to/current/working/directory
```

2. To record the provenance from a recently created R script:
```R
# Run provBookR with lite option specified
> provBookR("myscript.R", mode="full")
```
```
provBookR browser initializing...
Checking file extension...
Collecting provenance...
Provenance collected!
```
3. To explore the different object lineages or use the core E2E provenance processing tools:
```R
# Run provBookR with lite option specified
> provBookR("prov.json", mode="full")
```
```
provBookR browser initialized!
provBookR browser running, type "help" for more information or Q to quit
prov.json
provBookR> help
provBookR(operations)> [command][space][variable.name]:
Quit provBookR                                : "q"   
provBookR operations                          : "help"
List R objects                                : "ls"  
Show me how R object was created              : "BO"  
Show me what this R object was used to create : "AO"  
Summarize provenance                          : "S"   
Debug script                                  : "DB"  
Clean script                                  : "C"   
```
