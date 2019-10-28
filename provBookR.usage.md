# 1: ```provBookR().browser```
> The provBookR package uses a **browser interface** for the generation of **provbooks** and specification of **provenance operations**. The browser has two interface modes: **lite** and **full**. The lite mode is intended for quick generation of provbooks, while the full mode is intended to support the exploration of the collected provenance.

## 1.1: Using the browser's ```lite``` mode
```R
# Run provBookR with lite option specified
> provBookR("prov.json", mode="lite")
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
    provbook for variable "f" is stored in /path/to/current/working/directory

## 1.2: Using the browser's ```full``` mode (_quit/start_)

```R
# Run provBookR with full option specified (quit/start)
> provBookR("prov.json", mode="full")
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

## 1.3 Using the browser's ```full``` mode (_generate provbook_)
```R
# Run provBookR with full option specified (generate provbook)
> provBookR("prov.json", mode="full")
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

## 1.3.1 Showing provenance "before object" (BO)
    provBookR browser running, type "help" for more information or Q to quit
    prov.json
    provBookR> BO f
    [1] "f <- function(x) {\ty <- x^2\treturn(y)}"
    [2] "f"                                       
    Generate a provbook for this object history? (Y/N):
    provBookR> N

## 1.3.2 Showing provenance "after object" (AO)  
    provBookR browser running, type "help" for more information or Q to quit
    prov.json
    provBookR> AO f
    [1] "b"         "b <- f(a)" "f"        
    Generate a provbook for this object history? (Y/N):
    provBookR> Y
    Making provbook for "f" from prov.json...
    Done!
    provbook for variable "f" is stored in /path/to/current/working/directory
    provBookR browser running, type "help" for more information or Q to quit
    prov.json
    provBookR> quit
    Are you sure you want to quit? (Y/N):
    provBookR> Y

## 1.4 Using the browser's ```full``` mode (_E2E provenance_)    
```R
# Run provBookR with full options specified (E2E provenance tools)
provBookR("prov.json", mode="full")
```

    provBookR browser initializing...
    Checking file extension...
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
    provBookR browser running, type "help" for more information or Q to quit
    prov.json
    provBookR> S
    Running provSummarizeR...
    provBookR browser running, type "help" for more information or Q to quit
    prov.json
    provBookR> C
    Running RClean...
    provBookR browser running, type "help" for more information or Q to quit
    prov.json
    provBookR> DB
    Running provDebugR...
    Debug> Q
    Debugger initialized, type "help" for more information or Q to quit
    /path/to/current/working/directory/myscript.r
    provBookR browser running, type "help" for more information or Q to quit
    prov.json
    provBookR> Q
    Are you sure you want to quit? (Y/N):
    provBookR> Y
