# Set to the directory of provBookR
setwd("/Users/erickoduniyi/Documents/School/KU/Academics/2018-2019/Research/Hardvard-Forest/Projects/Fruits-Of-Provenance/Construction/Development-Code/provBookR/provBookR")

# Create a 2-by-2 matrix
my.data.frame <- as.data.frame(matrix(nr=5,nc=5))

# Name the columns in R
colnames(my.data.frame) <- c("X1", "X2","X3", "X4","X5")

# Insert data into the data frame
my.data.frame[1,1] <- 0

# Take the head of the data frame
head(my.data.frame)

# Swap columns of the data frame
my.data.frame <- my.data.frame[,c(2,1,3,4,5)]

# Populate an entire row of the data frame
my.data.frame[1:5,1:5] <- 1
