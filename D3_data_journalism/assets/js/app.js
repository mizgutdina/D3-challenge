// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500;

var margin = { //margin to space. Create wraping around chart
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right; //960-100-40=820
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter") //from html div id
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

  // Append an SVG group
var chartGroup = svg.append("g")
.attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "poverty";
var chosenYAxis = "obesity";

// function used for updating x-scale var upon click on axis label
function xScale(data, chosenXAxis) {
    // create scales
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(data, d => d[chosenXAxis]) * 0.8, //scale change based on data chosen
        d3.max(data, d => d[chosenXAxis]) * 1.2
      ])
      .range([0, width]);
 
    return xLinearScale;
 
  }
 
  function yScale(data, chosenYAxis) {
    // create scales
    var yLinearScale = d3.scaleLinear()
      .domain([d3.min(data, d => d[chosenYAxis]) * 0.8, //scale change based on data chosen
        d3.max(data, d => d[chosenYAxis]) * 1.2
      ])
      .range([height, 0]); //REVERSE FOR Y
 
    return yLinearScale;
 
  }


  // function used for updating xAxis var upon click on axis label
  function renderAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
 
    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);
 
    return xAxis;
  }

  function renderYAxes(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);
 
    yAxis.transition()
      .duration(1000)
      .call(leftAxis);
 
    return yAxis;
  }

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, circleLabels, newXScale, chosenXAxis) {

    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[chosenXAxis]));
 
    

    circleLabels.transition()
    .duration(1000)
    .attr("x", d=>newXScale(d[chosenXAxis]));

    return circlesGroup
    //return circleLabels;
  }
 
  function renderYCircles(circlesGroup, circleLabels, newYScale, chosenYAxis, ) { // 

    circlesGroup.transition()
      .duration(1000)
      .attr("cy", d => newYScale(d[chosenYAxis]));
 
    

    circleLabels.transition() //Does not work and pale WHY?
    .duration(1000)
    .attr("y", d=>newYScale(d[chosenYAxis]));
    return circlesGroup;
  }




  // function used for updating circles group with new tooltip
  function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {
 
    var label;
 
    if (chosenXAxis === "poverty") {
      label = "In Poverty (%)";
    }
    else if (chosenXAxis === "age") { //PROBABLY NEEDS ELSE IF BC 2 MORE AXIS: AGE(MEDIAN) & HOUSEHOLD INCOME(MEDIAN)
      label = "Age (Median)"; //three if / elsle if / else
    }
    else if (chosenXAxis === "income"){
      label = "Household Income (Median)"
  };
 
  var labelY;
 
  if (chosenYAxis === "obesity") {
    labelY = "Obese (%)";
  }
  else if (chosenYAxis === "smokes") { //PROBABLY NEEDS ELSE IF BC 2 MORE AXIS: AGE(MEDIAN) & HOUSEHOLD INCOME(MEDIAN)
    labelY = "Smokes (%)"; //three if / elsle if / else
  }
  else if (chosenYAxis === "healthcare"){
    labelY = "Lacks Healthcare"
};

    var toolTip = d3.tip() //tooltip shows the data, place tooltip //d3.tip zamenila na d3-tip
      .attr("class", "tooltip")
      .offset([80, -60])
      .style("position", "absolute")
      .style("background", "white")
      .style("color", "black")
      // .style("left", (d3.event.pageX + 15) + "px")
      // .style("top", (d3.event.pageY - 28) + "px")
      .html(function(d) {
        return (`${d.state}<br>${label}: ${d[chosenXAxis]}<br> ${labelY}: ${d[chosenYAxis]}`);
      });
 
    circlesGroup.call(toolTip);
      console.log(circlesGroup)
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });
 
    return circlesGroup;
  }
 

// Retrieve data from the CSV file and execute everything below
d3.csv("assets/data/data.csv").then(function(data, err) {
    if (err) throw err;
 
    // parse data
    data.forEach(function(data) {
      data.id = +data.id;
      data.state = data.state;
      data.abbr = data.abbr;
      data.poverty = +data.poverty;
      data.povertyMoe = +data.povertyMoe;
      data.age = +data.age;
      data.ageMoe = +data.ageMoe;
      data.income = +data.income;
      data.incomeMoe = +data.incomeMoe;
      data.healthcare = +data.healthcare;
      data.healthcareLow = +data.healthcareLow;
      data.healthcareHigh = +data.healthcareHigh;
      data.obesity = +data.obesity;
      data.obesityLow = +data.obesityLow;
      data.obesityHigh = +data.obesityHigh;
      data.smokes = +data.smokes;
      data.smokesLow = +data.smokesLow;
      data.smokesHigh = +data.smokesHigh;
      //WHAT TO DO ABOUT CORRELATION -0.385218228
        console.log(data.poverty)
        console.log(data.income)
        console.log(data.obesity)
    });
 
    // xLinearScale function above csv import
    var xLinearScale = xScale(data, chosenXAxis);
 
    // Create y scale function
    var yLinearScale = yScale(data, chosenYAxis);

    // var yLinearScale = d3.scaleLinear()
    //   .domain([0, d3.max(data, d => d.healthcare)]) //instead of num_hits - LACKS Healthcare = meaning? healthcareLow???
    //   .range([height, 0]);
 
    // Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);
 
    // append x axis
    var xAxis = chartGroup.append("g")
      .classed("x-axis", true)
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);
      
    // append y axis
      var yAxis = chartGroup.append("g")
      .classed("y-axis", true)
      //.attr("transform", `translate(0, ${height})`)
      .call(leftAxis); 


    
    // chartGroup.append("g")
    //   .call(leftAxis);
 
    // append initial circles
    var circlesGroup = chartGroup.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d[chosenXAxis]))
      .attr("cy", d => yLinearScale(d[chosenYAxis])) //LACKS HEALTHCARE (%)
      .attr("r", 20)
      .attr("fill", "blue")
      .attr("opacity", ".5");

    // cirlc labels - state abbr (adding text to circlesGroup)
    var circleLabels = chartGroup.selectAll(null)
                        .data(data)
                        .enter()
                        .append("text");
   
    circleLabels
      .attr("x", function(d) {
        return xLinearScale(d[chosenXAxis])
      })
      .attr("y", function(d) {
        return yLinearScale(d[chosenYAxis])
      })
      .text(function(d) {
        return d.abbr;
      })
      .attr("font-family", "sans-serif")
      .attr("font-size", "10px")
      .attr("text-anchor", "middle")
      .attr("fill", "white");


    // Create group for three x-axis labels
    var labelsGroup = chartGroup.append("g")
      .attr("transform", `translate(${width / 2}, ${height + 20})`);
 
    var povertyLabel = labelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 20)
      .attr("value", "poverty") // value to grab for event listener
      .classed("active", true)
      .text("In Poverty (%)");
 
    var ageLabel = labelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 40)
      .attr("value", "age") // value to grab for event listener
      .classed("inactive", true)
      .text("Age (Median)"); //NEEDS THIRD ONE FOR household income (median)
 
    var incomeLabel = labelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 60)
      .attr("value", "income")
      .classed("inactive", true)
      .text("Household Income (Median)");
    
    // append y axis
    var labelsGroupY = chartGroup.append("g")
    .attr("transform", "rotate(-90)")

    var obeseLabel = labelsGroupY.append("text")
    
      .attr("y", 15 - margin.left) 
      .attr("x", 0 - (height / 2))
      .attr("value", "obesity")
      .classed("active", true)
      .text("Obese (%)");
    
    var smokesLabel = labelsGroupY.append("text")
      
      .attr("y", 35 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("value", "smokes")
      .classed("inactive", true)
      .text("Smokes (%)");
    
    var healthcareLabel = labelsGroupY.append("text")
      
      .attr("y", 55 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("value", "healthcare")
      .classed("inactive", true)
      .text("Lacks Healthcare (%)");

   
 
   
 
    // updateToolTip function above csv import
    var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
 
    // x axis labels event listener
    labelsGroup.selectAll("text")
      .on("click", function() {
        // get value of selection
        var value = d3.select(this).attr("value"); //if value=poverty, poverty data is chosen
        if (value !== chosenXAxis) { //1st if u confirm if selection matches current axis
  //change if not equal. BC when ITS NOT U LISTEN TO CHANGE & reload chart
          // replaces chosenXAxis with value
          chosenXAxis = value;
 
           
 
          // functions here found above csv import
          // updates x scale for new data
          xLinearScale = xScale(data, chosenXAxis);
 
          // updates x axis with transition
          xAxis = renderAxes(xLinearScale, xAxis);
 
          // updates circles with new x values
         renderCircles(circlesGroup,circleLabels, xLinearScale, chosenXAxis);
          console.log("circlesGroup :: ",circlesGroup)
          // updates tooltips with new info
          circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
 
          // changes classes to change bold text
          if (chosenXAxis === "age") { //SECOND OPTION FOR X AXIS
            ageLabel
              .classed("active", true) //two inactive one active
              .classed("inactive", false);
            povertyLabel
              .classed("active", false)
              .classed("inactive", true);
            incomeLabel
              .classed("active", false)
              .classed("inactive", true);
          }
          else if (chosenXAxis === "poverty") { //else if chosemAxis ==== poverty =>three labels; else {bc defaults to healthcare#3}
            ageLabel
              .classed("active", false)
              .classed("inactive", true);
            povertyLabel
              .classed("active", true)
              .classed("inactive", false);
            incomeLabel
              .classed("active", false)
              .classed("inactive", true);
          }
          else {
            ageLabel
              .classed("active", false)
              .classed("inactive", true);
            povertyLabel
              .classed("active", false)
              .classed("inactive", true);
            incomeLabel
              .classed("active", true)
              .classed("inactive", false);
          }
        }
      });

//attempt of same with Y
labelsGroupY.selectAll("text")
.on("click", function() {
  // get value of selection
  var value = d3.select(this).attr("value"); //if value=poverty, poverty data is chosen
  if (value !== chosenYAxis) { //1st if u confirm if selection matches current axis
//change if not equal. BC when ITS NOT U LISTEN TO CHANGE & reload chart
    // replaces chosenXAxis with value
    chosenYAxis = value;

    // console.log(chosenXAxis)

    // functions here found above csv import
    // updates x scale for new data
    yLinearScale = yScale(data, chosenYAxis);
    console.log(chosenYAxis)

    // updates x axis with transition
    yAxis = renderYAxes(yLinearScale, yAxis); //yLinearScale

    // updates circles with new x values
    renderYCircles(circlesGroup,circleLabels, yLinearScale, chosenYAxis);//

    // updates tooltips with new info
     updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

    // changes classes to change bold text
    if (chosenYAxis === "obesity") { //SECOND OPTION FOR X AXIS
      obeseLabel
        .classed("active", true) //two inactive one active
        .classed("inactive", false);
      smokesLabel
        .classed("active", false)
        .classed("inactive", true);
      healthcareLabel
        .classed("active", false)
        .classed("inactive", true);
    }
    else if (chosenYAxis === "smokes") { //else if chosemAxis ==== poverty =>three labels; else {bc defaults to healthcare#3}
      obeseLabel
        .classed("active", false)
        .classed("inactive", true);
      smokesLabel
        .classed("active", true)
        .classed("inactive", false);
      healthcareLabel
        .classed("active", false)
        .classed("inactive", true);
    }
    else {
      obeseLabel
        .classed("active", false)
        .classed("inactive", true);
      smokesLabel
        .classed("active", false)
        .classed("inactive", true);
      healthcareLabel
        .classed("active", true)
        .classed("inactive", false);
    }
  }
});




  }).catch(function(error) {
    console.log(error);
  });
