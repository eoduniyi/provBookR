
# 1. Running ```R provBookR()```


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

    
    Attaching package: ‘lubridate’
    
    The following object is masked from ‘package:base’:
    
        date
    
    ── [1mAttaching packages[22m ─────────────────────────────────────── tidyverse 1.2.1 ──
    [32m✔[39m [34mggplot2[39m 3.2.0     [32m✔[39m [34mpurrr  [39m 0.3.2
    [32m✔[39m [34mtibble [39m 2.1.3     [32m✔[39m [34mdplyr  [39m 0.8.3
    [32m✔[39m [34mtidyr  [39m 0.8.3     [32m✔[39m [34mstringr[39m 1.4.0
    [32m✔[39m [34mreadr  [39m 1.3.1     [32m✔[39m [34mforcats[39m 0.4.0
    ── [1mConflicts[22m ────────────────────────────────────────── tidyverse_conflicts() ──
    [31m✖[39m [34mlubridate[39m::[32mas.difftime()[39m masks [34mbase[39m::as.difftime()
    [31m✖[39m [34mlubridate[39m::[32mdate()[39m        masks [34mbase[39m::date()
    [31m✖[39m [34mdplyr[39m::[32mfilter()[39m          masks [34mstats[39m::filter()
    [31m✖[39m [34mlubridate[39m::[32mintersect()[39m   masks [34mbase[39m::intersect()
    [31m✖[39m [34mdplyr[39m::[32mlag()[39m             masks [34mstats[39m::lag()
    [31m✖[39m [34mlubridate[39m::[32msetdiff()[39m     masks [34mbase[39m::setdiff()
    [31m✖[39m [34mlubridate[39m::[32munion()[39m       masks [34mbase[39m::union()
    
    Attaching package: ‘shiny’
    
    The following objects are masked from ‘package:DT’:
    
        dataTableOutput, renderDataTable
    
    
    Attaching package: ‘shinyjs’
    
    The following object is masked from ‘package:shiny’:
    
        runExample
    
    The following object is masked from ‘package:lubridate’:
    
        show
    
    The following objects are masked from ‘package:methods’:
    
        removeClass, show
    
    
    Attaching package: ‘provSummarizeR’
    
    The following object is masked from ‘package:rdtLite’:
    
        prov.summarize
    



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


```R
# Load browser
	# Query Provenance
		# Summarize provenance
		# Move Forward
			# Error Handling: Check for malicious input
		# Move Backward
			# Error Handling: Check for malicious input
		# Generate provbook
			# Error Handling: make sure data pipeline is robust
			# Add annotations
				# Error Handling: Check for malicious input
			# Specify layout
				# Error Handling: Check for malicious input
		     # Create dynamic html
			     	# Error Handling: make sure data pipeline is robust
			# provbook.html()
# TODO: Run provBookR with no mode specified options
provBookR <- function(file.name, mode){
  
  # Collect the user input mode
  switch(tolower(mode),
         "lite" = provBookR.lite(file.name), # "lite" mode
         "full" = provBookR.prov.browse(file.name), # "full" mode
         "default" = provBookR.prov.browse(file.name) # Default: "full" mode
         )
}

# "provBookRLite"
provBookR.lite <- function(file.name){
    
    # Ask user for data.object.name
    message("variable name?: ")
    data.object.name <- readline(prompt="provBookR.lite> ")
    
    # Alert user
    message(paste("Running provBookR lite for ", data.object.name, " ", "from ", file.name, "...", sep=""))

    # Check the file type of file.name
    if(json.check(file.name)){
        # Query provenance
        provBookR.prov.querying(file.name, data.object.name, "BO")
    }else{
        # Record provenance
        recorded.prov <- provBookR.prov.recording(file.name)
        # Query provenance
        provBookR.prov.querying(recorded.prov, data.object.name, "BO")
    }
  
    message("Generate a provbook for this object history? (Y/N):") # Output message to the user
    user.input <- tolower(readline(prompt="provBookR> ")) # Collect user input
    if(user.input == "y"){
        
        # Generate provbook
        # Call provbook generator
        # UI.user.input.BG(prov.json, data.object.name)
        message("Done!")
        cat(paste("provbook for variable ", "\"", data.object.name, "\"", " is stored in ", getwd(), sep=""))
        
    }else{
        stop("closing provBookr.lite...") # Closing provBookR.lite()
    }
    

}

# Check if the input file is a .json or .R file
json.check <- function(file.name){
  message("Checking file extension...") # Output message to the user
  if(grepl("\\.json", file.name)){
    return(TRUE) # The file is a .json
  }
  else if(grepl("\\.r", file.name) | grepl("\\.R", file.name) | grepl("\\.rmd", file.name)){
    return(FALSE) # The file is a .R file
  }else{
    stop("This is neither a .JSON, .R, or .RMD file") # Dude...give me the correct input, please
  }
}
```

# 2. ```provBookR.browser()```

The inspiration for the```provBookR.browser()``` comes from the ```debug.browser()``` function. In the say way, users can browser through the lineage collected first, and then, determine if they would like to generate a provbook

## 2.1 ```debug.browser()```


```R
library(provDebugR)
debug.init("prov.json")
```


```R
debug.browser()
```

    Debug> Q
    Debugger initialized, type "help" for more information or Q to quit
    /Users/erickoduniyi/Documents/School/KU/Academics/2018-2019/Research/Hardvard-Forest/Projects/Fruits-Of-Provenance/Construction/Development-Code/Jupyter/myscript.r
    2: f <- function(x) {	y <- x^2	return(y)}
    [1] "Quitting"



```R
# provBookR browser interface
# Input: File name
# Output: Starts provBook.browser()
provBookR.prov.browse <- function(file.name){

  # Begin initializing browser
  initializing.browser.message <- "provBookR browser initializing..."
  message(initializing.browser.message) # Output message to the user

  # Check the file type of file.name
  if(json.check(file.name)){
    # Start browser
    prov.browser(file.name) 
  }else{
    # Record provenance
    recorded.prov <- provBookR.prov.recording(file.name) # outputs a .json

    # Start browser
    prov.browser(recorded.prov)
  } 
}
```


```R
# provBookR browser interface
# Input: .json file 
# Output: provbook options
prov.browser <- function(file.name){
    
  # Output message to the user  
  message("provBookR browser initialized!") 

  # Start browser loop...
  UI.condition <- TRUE
  while(UI.condition){

    # Let the user know the browser is running
    initial.options.message <- "provBookR browser running, type \"help\" for more information or Q to quit"
    initial.options.prompt <- paste(initial.options.message, file.name, sep="\n")
    message(initial.options.prompt) # Output message to the user
    
    # Collecting initial user input
    user.input <- readline(prompt="provBookR> ")
    user.input.strip <- strsplit(user.input, "\\s+")[[1]]
    user.input.command <- user.input.strip[1]
    data.object.name <- user.input.strip[2]
    if(user.input.command == "q" | user.input.command == "Q" | tolower(user.input.command) == "quit"){
      # Call provbook quit menu
      UI.condition <- UI.user.input.quit()
    }else if(user.input.command == "help" | user.input.command == "h" | user.input.command == "?"){
      # Call provbook help menu
      UI.user.input.help()
    }else if(user.input.command == "ls" | user.input.command == "LS"){
        # Print the nodes
        provBookR.print.nodes(file.name)
    }else if(user.input.command == "ao" | user.input.command == "AO"){
      # Call provbook forweard lineage
      UI.user.input.AO(file.name, data.object.name, "AO")
    }else if(user.input.command == "bo" | user.input.command == "BO"){
      # Call provbook backward lineage
      UI.user.input.BO(file.name, data.object.name, "BO")
    }else if(user.input.command == "s" | user.input.command == "S"){
      # Call provSummarizeR
      UI.user.input.S(file.name)  
    }else if(user.input.command == "db"| user.input.command == "DB"){
      # Call provDebugR
      UI.user.input.DB(file.name)
    }else if(user.input.command == "c" | user.input.command == "C" | tolower(user.input.command)  == "clean"){
      # Call Rclean
      UI.user.input.C(file.name)
    }else{
        # Output message to the user
        message(paste("command not supported"), sep="\n")
    }
  }
}

# browser "quit" helper function
# Input: User input
# Output: Looping condition
UI.user.input.quit  <- function(){
  
  # Alert user about their quit options  
  message("Are you sure you want to quit? (Y/N):")
  user.input <- tolower(readline(prompt="provBookR> ")) # Collect user input
  if(user.input == "y"){
    return(FALSE) # quit provBookR.browser()
  }else{
    return(TRUE) # continue provBookR.browser()
  }
}

# browser "help" helper function
# Input: User input
# Output: Help menu
UI.user.input.help  <- function(){
  
  # Create user "help menu"
  cat("provBookR(operations)> [command][space][variable.name]:\n")
  options <- c("Quit provBookR", "provBookR operations", "List R objects", "Show me how R object was created",
               "Show me what this R object was used to create", "Summarize provenance", "Debug script", "Clean script")
  options.df <- data.frame(options = options, sep = ':', nchar = c("\"q\"", "\"help\"", "\"ls\"", "\"BO\"", "\"AO\"",
                                                                  "\"S\"", "\"DB\"", "\"C\""))
  # Output the help menu to the user  
  menu <- capture.output(gdata::write.fwf(options.df, width = c(max(nchar(options)), 1, 6), justify = 'l'))[-1]
  cat(menu, sep = '\n')
}
      
# Prints list of data.object.names
# Input: Parsed .json
# Output: Printed list of variables
# TODO: Might need to include procedure nodes
provBookR.print.nodes <- function(prov.json){
    
    # Parse .json file
    parsed.json <- prov.parse(prov.json)

    # Print procedure and data nodes
    data.nodes <- get.data.nodes(parsed.json)  # Get the data nodes
    return(print(data.nodes[, c("name")]))
}

# Collect forward lineage
# Input: .json file, data.object.name, history
# Output: provbook
UI.user.input.AO <- function(prov.json, data.object.name, history){
    
    # Output lineage
    provBookR.prov.querying(prov.json, data.object.name, history)
    
    # Ask the user if they would like to generate a provbook
    message("Generate a provbook for this object history? (Y/N):") # Output message to the user
    user.input <- tolower(readline(prompt="provBookR> ")) # Collect user input
    if(user.input == "y"){
        
        # Call provbook generator
        UI.user.input.BG(prov.json, data.object.name)
        
    }else{
        return(TRUE) # Continue provBookR.browser()
    }
}

# Collect backward lineage
# Input: .json file, data.object.name, history
# Output: provbook      
UI.user.input.BO <- function(prov.json, data.object.name, history){

    # Output lineage
    provBookR.prov.querying(prov.json, data.object.name, history)
    
    # Ask the user if they would like to generate a provbook
    message("Generate a provbook for this object history? (Y/N):") # Output message to the user
    user.input <- tolower(readline(prompt="provBookR> ")) # Collect user input
    if(user.input == "y"){
        
        # Call provbook generator
        UI.user.input.BG(prov.json, data.object.name)

    }else{
        return(TRUE) # Continue provBookR.browser() 
    }   
}
             
# provSummarizeR helper function
# Input: prov.json
# Output: Summarized provenance
UI.user.input.S  <- function(file.name){
    
    # Run provSummaizeR
    cat("\n")
    message("Running provSummarizeR...")
    cat("\n")
}
             
# provDebugR "BG" helper function
# Input: prov.json
# Output: provDebugR
UI.user.input.DB  <- function(file.name){
    
    # Run provDebugR
    cat("\n")
    message("Running provDebugR...")
    cat("\n")
    debug.init("prov.json")
    debug.browser()

}

# browser "BG" helper function
# Input: prov.json
# Output: Cleaned .R script
UI.user.input.C  <- function(file.name){
    
    # Run RClean
    cat("\n")
    message("Running RClean...") 
    cat("\n")
}

# browser "BG" helper function
# Input: User input
# Output: provbook
UI.user.input.BG  <- function(prov.json, data.object.name){
    
    # Generate provbook
    message(paste("Making provbook for ", "\"", data.object.name, "\"", " ", "from ", prov.json, "...", sep=""))
    message("Done!")
    cat(paste("provbook for variable ", "\"", data.object.name, "\"", " is stored in ", getwd(), sep=""))
}     
```

# 2.1 ```R provBookR.prov.recording()```


```R
# provBookR: Recording
# Inputs: A .R file or .json file
# Outputs: Recorded provenance
provBookR.prov.recording <- function(file.name){

    # Alert the user about the provenance collection process
    message(paste("Collecting provenance for ", file.name, "..."))

    # Collect the provenance specifying the maximum snapshot size
    rdtLite::prov.run(file.name, prov.dir=".", overwrite=FALSE, snapshot.size = Inf)

    # Create a directory to store the collected provenance
    dir.create("provenance")  

    # Collect the generated provenance directories
    # Only collect the folders that have "prov_file.name_"
    # This allows provBook to check all the current and previously collected provenance directories
    prov.dir.names <- list.files(pattern="^prov_")
    path.to.prov.dir <- prov.dir.names[length(prov.dir.names)] # Gets the last datetime 
    path.to.json <- paste(getwd(),"/provenance/", path.to.prov.dir, "/prov.json", sep="")
    file.copy(path.to.prov.dir, "provenance", recursive=TRUE, overwrite=TRUE)
 
    # Return the user the path to the created provenance
    return(path.to.json)
}
```

# 2.2 ```R provBookR.prov.querying()```


```R
# provBookR: Querying
# Inputs: .json file
# Outputs: Parsed provenance
provBookR.prov.querying <- function(prov.json, data.object.name, history){
    
  # Parse the prov.json file:
  parsed.json <- prov.parse(prov.json)
  if(provBookR.check.nodes(parsed.json, data.object.name)){
      
      # Get the corresponding node.id
      parsed.prov <- get.variable.named(prov.parse(prov.json), data.object.name) # Query the provenance             
      node.id <- parsed.prov[1, c("id")]
      
      # Collect the variable lineage for the procedure node
      switch(history, "AO" = lineage <- provBookR.lineage(prov.json, node.id, "AO"),
                      "BO" = lineage <- provBookR.lineage(prov.json, node.id, "BO") )
      variable.history <- provBookR.variable.lineage(prov.json, lineage)
      return(print(variable.history))
  }else{
        message(paste("provenance for", data.object.name, "does not exist", sep=" "))
  }
}

# Checks the existence of data.object.name
# Input: Parsed .json, data object name
# Output: Boolean
provBookR.check.nodes <- function(parsed.json, data.object.name){
    
    # Get the data node names
    data.nodes <- get.data.nodes(parsed.json)
    
    # Check if the data.object.name exist
    if(data.object.name %in% data.nodes[, c("name")]){
        return(TRUE) # data.object.name is in the provenance
    }else{
        return(FALSE) # data.object.name is not available
    }    
}

# Shows data.object.name lineage
# Input: Parsed .json, lineage
# Output: Variable lineage
provBookR.variable.lineage <- function(prov.json, lineage){
    
    # Collect the variable lineage
    proc.nodes <- get.proc.nodes(prov.parse(prov.json)) # Collect the procedure or data nodes  
    data.nodes <- get.data.nodes(prov.parse(prov.json)) # Collect the procedure or data nodes  
    var.vector <- c()
    for(i in 1:length(lineage)){
        if(grepl("p", lineage[i])){
            # Collect procedure nodes
            var.vector <- c(proc.nodes[proc.nodes$id == lineage[i], c("name")], var.vector)
        }else{
            # Collect data nodes
            var.vector <- c(data.nodes[data.nodes$id == lineage[i], c("name")], var.vector)
        }
    }
    # Give the user back a lineage of the R object
    return(var.vector)
}

# Collects provenance lineage
# Input: .json file, node.id, direction
# Output: Node lineage
provBookR.lineage <- function(prov.json, node.id, direction){

  # Create adj.graph
  adj.graph <- create.graph(prov.json, isFile = T)

  # Collect the lineage from the provenance
  switch(direction,
         "AO" = lineage <- get.lineage(adj.graph, node.id, forward = T),
         "BO" = lineage <- get.lineage(adj.graph, node.id, forward = F),
         "default" = message("provenance direction has not been specified.") # Output message to the user
  )
  
  # Return the lineage from provGraphR
  return(lineage)
}
```
