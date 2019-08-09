library(shiny)

# Define UI for miles per gallon app ----
ui <- pageWithSidebar(
  
  # App title ----
  headerPanel("Hello World!: This is my first shiny app"),
  
  # Sidebar panel for inputs ----
  sidebarPanel(
    selectInput("Distribution", "Please Select Distribution Type",
                choices = c("Normal", "Exponential")),
    sliderInput("sampleSize", "Please Select Sample Size: ",
                min = 100, max = 5000, value = 1000, step = 100),
    conditionalPanel(condition = "input.Distribution == 'Normal'",
                     textInput("mean", "Please Select the mean", 3),
                     textInput("sd", "Please Select Standard Deviation",3)),
    conditionalPanel(condition = "input.Distribution == 'Exponential'",
                     textInput("lambda", "Please Select Exponential Lambda", 1))
  ),
  
  # Main panel for displaying outputs ----
  mainPanel(
    plotOutput("myPlot")
  )
)

# Define server logic to plot various variables against mpg ----
server <- function(input, output, session){
  
  output$myPlot <- renderPlot({
    distType <- input$Distribution
    size <- input$sampleSize
   
    if(distType == "Normal"){
      randomVec <- rnorm(size, mean = as.numeric(input$mean), sd = as.numeric(input$sd))
    }
    else{
      randomVec <- rexp(size, rate = 1/as.numeric(input$lambda))
    }
    
    hist(randomVec, col="black")
    
  })
}
shinyApp(ui, server)