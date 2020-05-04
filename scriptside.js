
//What has been done are two graphs just to get started. It is quite ugly for now and many things have to be adjusted, no interactivity has been added
//THINGS TO FIX:

//THINGS THAT COULD BE ADDED TO MAKE GRAPHS BETTER, IDEAS
//1. Make a sort button or something to sort ascending or descending
//3. Hover over charts to get values

var dataPath = "data/WorlCupSquadsInfoVis.csv"; //Datapath for data which will be read in

var mySVG = d3.select("#MySVG"); //First graph
var mySVG2 = d3.select("#MySVG2"); //Second graph
var margin = 80;					//Margin for second graph
var width = document.getElementById("MySVG2").clientWidth/1.7; 
var height = document.getElementById("MySVG2").clientHeight/1.7;
var categoricalScale = d3.scaleOrdinal(d3.schemeCategory10); //Colour palate

//Set scales for x and y
var xScale = d3.scaleBand()
				 .range([margin,width])
				 .padding(0.2);

var yScale = d3.scaleLinear()
			 .range([height-margin,0]);

var counter = 0;

d3.csv(dataPath) //Read in Data
    .then(function(data){
        //console.table(data);
        //console.log(data);
        
		//Dataset for graph 1
        var nestedData = d3.nest()	//Create seperate datset for total caps of each coutnry
            .key(function(d){
                return d.team;
            })
            .rollup(function(leaves)
            {
                return d3.sum(leaves,function(d){ 	//Sum caps of each country together
                return parseInt(d.Caps);
                })
            })
            .entries(data);
        console.log(nestedData);
		

		//Dataset for graph2
	  var nestedData2 = d3.nest()	//Create seperate datset for total caps of each positoin
            .key(function(d){
                return d.position;
            })
            .rollup(function(leaves)
            {
                return d3.mean(leaves,function(d){ 	//Get mean caps of each country together
                return parseInt(d.Caps);
                })
            })
            .entries(data);
        console.log(nestedData2);
		
		//Dataset for filtering graph 2
		  var nestedData3 = d3.nest()	//Create seperate datset for total caps of each positoin
            .key(function(d){
                return d.team;
            })
		  	.key(function(d){
				return d.position;
			})
            .rollup(function(leaves)
            {
                return d3.mean(leaves,function(d){ 	//Get mean caps of each country together
                return parseInt(d.Caps);
                })
            })
            .entries(data);
	
		 var nestedAge = d3.nest()	//Create seperate datset for total caps of each positoin
            .key(function(d){
                return d.position;
            })
            .rollup(function(leaves)
            {
                return d3.mean(leaves,function(d){ 	//Get mean caps of each country together
                return parseInt(d.age);
                })
            })
            .entries(data);
        console.log(nestedAge);
	
		  var nestedAge2 = d3.nest()	//Create seperate datset for total caps of each positoin
            .key(function(d){
                return d.team;
            })
		  	.key(function(d){
				return d.position;
			})
            .rollup(function(leaves)
            {
                return d3.mean(leaves,function(d){ 	//Get mean caps of each country together
                return parseInt(d.age);
                })
            })
            .entries(data);
	
	
		//Sort datasets so it is displayed sorted by default
		nestedData.sort(function(a,b){
			return d3.descending(a.value,b.value)
		})
	
		nestedData2.sort(function(a,b){
			return d3.descending(a.value,b.value)
		})
	

		var margin1 = {top: 20, right: 30, bottom: 40, left: 90}
		var width1 = 500 - margin1.left - margin1.right;
		var height1 = 700 - margin1.top - margin1.bottom;

	
	
		  // Add X axis
		  var xScale1 = d3.scaleLinear()
			.range([ 0, width1]);

	    // Y axis
	 	var yScale1 = d3.scaleBand()
			.range([ 0, height1 ])
			.padding(0.2);
	
		xScale1.domain([0,d3.max(nestedData,function(d)
				{
					console.log(d.value)
					return d.value;
				})])
	
		yScale1.domain(nestedData.map(function(d)
				{
					return d.key;
				}))
		// append the svg object to the body of the page

	  mySVG
		.attr("width", width1 + margin1.left + margin1.right)
		.attr("height", height1 + margin1.top + margin1.bottom)
	  mySVG.append("g")
		.attr("transform",
			  "translate(" + margin1.left + "," + margin1.top + ")");




				
  mySVG.append("g")
    .attr("transform", "translate(0," + height1 + ")")
    .call(d3.axisBottom(xScale1))
    .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

  //Bars
  mySVG.selectAll("myRect")
    .data(nestedData)
    .enter()
    .append("rect")
    .attr("x", xScale1(0) )
    .attr("y", function(d) { return yScale1(d.key); })
    .attr("width", function(d) { return xScale1(d.value); })
    .attr("height", yScale1.bandwidth() )
    .attr("fill", "pink")
	.attr('stroke', 'black')
	.on("mouseenter", function(d,i){
	 	d3.select(this)
	  		.style("fill",)
  })

		//Add label of each country to bar chart
	mySVG.selectAll(".label")
		.data(nestedData)
		.enter()
		.append("text")
			.attr("x",0)
			.attr("y", function(d,i){
				return 15+i*20;
			})
			.text(function(d){
				return d.key;
		})
			//Add title to plot
	mySVG.append("text")
		.attr("x", width1-300)             
		.attr("y",height1+60)
		.style("font-size", "25px") 
		.text("Total Caps by Country");
			
	
		var dropDownMenu = d3.select("#dropDownList");
	
		dropDownMenu
			.selectAll("option")
			.data(nestedData)
			.enter()	
			.append("option")
				.attr("value",function(d){
					return d.key;
				})
				.text(function(d){
					return d.key;
				})

		dropDownMenu
			.on("change",function(){
				var menuItem = d3.select(this)
					.property("value");
			console.log(menuItem);
			if(menuItem != "All")
			{
				filterData(menuItem);
			}
		})
	
		var myButton = d3.select("#ageButton")
		
		myButton	
			.on("click",function(){
			var changeChart = document.getElementById("dropDownList").value;
			counter++;
			if(counter%2 != 0)
			{
				updateTimeline(nestedAge)
				filterData(changeChart);
			}
			else
			{
				updateTimeline(nestedData2);
				filterData(changeChart);
			}
		})
		
		updateTimeline(nestedData2);
		function filterData(country)
		{
			//filteredData = JSON.parse(JSON.stringify(nestedData3))
			//console.log(filteredData)
			if(counter%2 == 0)
			{
				nestedData3.some(function(d) //Some can stop the loop when condition is fulfilled
				{	
					if(d.key == country)
					{
						updateTimeline(d.values);
						return;
						//Actually stops the loop when condition is fulfilled, with forEach the loops keeps going.
					}	
				})
			}
			else
			{
				nestedAge2.some(function(d) //Some can stop the loop when condition is fulfilled
				{	
					if(d.key == country)
					{
						updateTimeline(d.values);
						return;
						//Actually stops the loop when condition is fulfilled, with forEach the loops keeps going.
					}	
				})
			}
			
		}
		
		function updateTimeline(updatedData)
		{
			
			//For sorting, make better later
			updatedData.sort(function(a,b){
				return d3.descending(a.value,b.value)
			})

			
			console.log(updatedData);
			
				xScale.domain(updatedData.map(function(d)
				{
					console.log(d.key)
					return d.key;
				}))
				yScale.domain([0,d3.max(updatedData,function(d)
				{
					console.log(d.value)
					return d.value;
				})])
			mySVG2.selectAll(".bar")
				.remove();
			
			mySVG2.selectAll(".bar")
			.data(updatedData)
			.enter()
			.append("rect") //Add rectangles and adjust size of width, height
				.attr("id","rect2")
				.attr("class","bar")
				.attr("x",function(d){
					return xScale(d.key);
				})
				.attr("width",xScale.bandwidth())
				.attr("y",function(d){
					console.log(d.value);
					return yScale(d.value);
				})
				.attr("height", function(d){
					return height -margin- yScale(d.value);
				})
				.style("fill",function(d){
					return categoricalScale(d.key) //Add different colours for each position
				})
			//Update Axis and label for positions
			mySVG2.selectAll("g")
				.remove();
			mySVG2.selectAll("text")
				.remove();
				mySVG2.selectAll("text")
				.data(updatedData)
				.enter()
				.append("text")
					.attr("x", function(d){
							return xScale(d.key);
						})
					.style("font-size", "28px")
					.attr("y",height-margin-10)
					.text(function(d){
						return d.key;
					})
			//Update y-axis
			mySVG2.append("g")
					.attr("transform", "translate("+margin+ ",0)")
					.style("font-size","25px")
					.call(d3.axisLeft(yScale));
		
			//Add title to plot
			if(counter%2==0)
			{
			mySVG2.append("text")
				.attr("x", 50)             
				.attr("y", height-50)
				.style("font-size", "25px") 
				.text("Average Caps by Position");
			
			}
			else
			{
				mySVG2.append("text")
					.attr("x", 50)             
					.attr("y", height-50)
					.style("font-size", "25px") 
					.text("Average Caps by Age");
			}
		}
			
	
			
})

