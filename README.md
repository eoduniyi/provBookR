
# 1. Running ```provBookR()```

```R
# Data tools:
library(DT)
library(gsubfn)
library(lubridate)
library(tidyverse)

# HTML tools:
library(knitr)
library(htmltools)
library(markdown)
library(shiny)
library(shinyjs)

# Provenance tools:
library(rdtLite) # Load Provenance Collector
library(provGraphR) # Load Provenance Traveler
library(provParseR) # Load Provenance Parser
library(provDebugR) # Load Provenance Debugger
library(provSummarizeR) # Load Provenance Summarizer
```
---

# 2. Using ```provBookR().browser```
```R
# Run provBookR with full options specified (E2E provenance tools)
provBookR("prov.json", mode="full")
```

    provBookR browser initializing...
    Checking file extension...
    provBookR browser initialized!
    provBookR browser running, type "help" for more information or Q to quit
    prov.json
    .
    .
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
    .
    .
    provBookR browser running, type "help" for more information or Q to quit
    prov.json
    .
    .
    provBookR> S
    .
    .
    .
    Running provSummarizeR...
    .
    .
    .
    .
    .
    provBookR browser running, type "help" for more information or Q to quit
    prov.json
    .
    .
    .
    provBookR> C
    .
    .
    .
    Running RClean...
    .
    .
    .
    .
    .
    provBookR browser running, type "help" for more information or Q to quit
    prov.json
    .
    .
    .
    provBookR> DB
    .
    .
    .


    Running provDebugR...


    Debug> Q

    Debugger initialized, type "help" for more information or Q to quit
    /Users/erickoduniyi/Documents/School/KU/Academics/2018-2019/Research/Hardvard-Forest/Projects/Fruits-Of-Provenance/Construction/Development-Code/Jupyter/myscript.r
    2: f <- function(x) {	y <- x^2	return(y)}
    [1] "Quitting"


    provBookR browser running, type "help" for more information or Q to quit
    prov.json


    provBookR> ls
    [1] "f"             "a"             "b"             "dev.off.4.pdf"


    provBookR browser running, type "help" for more information or Q to quit
    prov.json


    provBookR> BO b
    [1] "a <- 10"                                 
    [2] "a"                                       
    [3] "f <- function(x) {\ty <- x^2\treturn(y)}"
    [4] "f"                                       
    [5] "b <- f(a)"                               
    [6] "b"                                       


    Generate a provbook for this object history? (Y/N):


    provBookR> N


    provBookR browser running, type "help" for more information or Q to quit
    prov.json


    provBookR> Q


    Are you sure you want to quit? (Y/N):


    provBookR> Y



```R
# Run provBookR with full option specified (quit/start)
provBookR("prov.json", mode="full")
```

    provBookR browser initializing...
    Checking file extension...
    provBookR browser initialized!
    provBookR browser running, type "help" for more information or Q to quit
    prov.json


    provBookR> help
    provBookR operations [command][space][variable.name]:
    Quit provBookR                                : "q"   
    provBookR operations                          : "help"
    List R objects                                : "ls"  
    Show me how R object was created              : "BO"  
    Show me what this R object was used to create : "AO"  
    Summarize provenance                          : "S"   
    Debug script                                  : "DB"  
    Clean script                                  : "C"   


    provBookR browser running, type "help" for more information or Q to quit
    prov.json


    provBookR> q


    Are you sure you want to quit? (Y/N):


    provBookR> y



```R
# Run provBookR with full option specified (generate provbook)
provBookR("prov.json", mode="full")
```

    provBookR browser initializing...
    Checking file extension...
    provBookR browser initialized!
    provBookR browser running, type "help" for more information or Q to quit
    prov.json


    provBookR> help
    provBookR operations [command][space][variable.name]:
    Quit provBookR                                : "q"   
    provBookR operations                          : "help"
    List R objects                                : "ls"  
    Show me how R object was created              : "BO"  
    Show me what this R object was used to create : "AO"  
    Summarize provenance                          : "S"   
    Debug script                                  : "DB"  
    Clean script                                  : "C"   


    provBookR browser running, type "help" for more information or Q to quit
    prov.json


    provBookR> ls
    [1] "f"             "a"             "b"             "dev.off.4.pdf"


    provBookR browser running, type "help" for more information or Q to quit
    prov.json


    provBookR> BO f
    [1] "f <- function(x) {\ty <- x^2\treturn(y)}"
    [2] "f"                                       


    Generate a provbook for this object history? (Y/N):


    provBookR> N


    provBookR browser running, type "help" for more information or Q to quit
    prov.json


    provBookR> AO f
    [1] "b"         "b <- f(a)" "f"        


    Generate a provbook for this object history? (Y/N):


    provBookR> Y


    Making provbook for "f" from prov.json...
    Done!


    provbook for variable "f" is stored in /Users/erickoduniyi/Documents/School/KU/Academics/2018-2019/Research/Hardvard-Forest/Projects/Fruits-Of-Provenance/Construction/Development-Code/Jupyter

    provBookR browser running, type "help" for more information or Q to quit
    prov.json


    provBookR> quit


    Are you sure you want to quit? (Y/N):


    provBookR> Y



```R
# Run provBookR with lite option specified
provBookR("prov.json", mode="lite")
```

    variable name?:


    provBookR.lite> f


    Running provBookR lite for f from prov.json...
    Checking file extension...


    [1] "f <- function(x) {\ty <- x^2\treturn(y)}"
    [2] "f"                                       


    Generate a provbook for this object history? (Y/N):


    provBookR> Y


    Done!


    provbook for variable "f" is stored in /Users/erickoduniyi/Documents/School/KU/Academics/2018-2019/Research/Hardvard-Forest/Projects/Fruits-Of-Provenance/Construction/Development-Code/Jupyter
