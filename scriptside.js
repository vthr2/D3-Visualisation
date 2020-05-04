
//What has been done are two graphs just to get started. It is quite ugly for now and many things have to be adjusted, no interactivity has been added
//THINGS TO FIX:

//THINGS THAT COULD BE ADDED TO MAKE GRAPHS BETTER, IDEAS
//1. Make a sort button or something to sort ascending or descending
//3. Hover over charts to get values

var dataPath = "data/WorlCupSquadsInfoVis.csv"; //Datapath for data which will be read in

var mySVG = d3.select("#MySVG"); //First graph
var mySVG2 = d3.select("#MySVG2"); //Second graph
var mySVG3 = d3.select("#MySVG3"); //Thrid Graph
var margin = 80;					//Margin for second graph
var width = document.getElementById("MySVG2").clientWidth/1.7;
var height = document.getElementById("MySVG2").clientHeight/1.7;
var categoricalScale = d3.scaleOrdinal(d3.schemeCategory10); //Colour palate
var counter = 0;
//Set scales for x and y
var xScale = d3.scaleBand()
	.range([margin,width])
	.padding(0.2);

var yScale = d3.scaleLinear()
	.range([height-margin,0]);


d3.csv(dataPath) //Read in Data
 	.then(function(data){
	//Dataset for graph 1
	var nestedData = d3.nest()	//Create seperate datset for total caps of each coutnry
  		.key(function(d){
        	return d.team;
            })
        .rollup(function(leaves){
            return d3.sum(leaves,function(d){ 	//Sum caps of each country together
            return parseInt(d.Caps);
            })
        })
        .entries(data);

	 //Dataset for graph2
	  var nestedData2 = d3.nest()	//Create seperate datset for average age of each country
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

		//Dataset for filtering graph 2
		  var nestedData3 = d3.nest()	//Filter countries so each country has the average cap of each position, used for filtering for each country from dropdown list
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
	
		//Dataset for graph 2 with age
		 var nestedAge = d3.nest()	//Create seperate datset for average age of each country
            .key(function(d){
                return d.position;
            })
            .rollup(function(leaves)
            {
                return d3.mean(leaves,function(d){ 	//Get mean age of each country together
                return parseInt(d.age);
                })
            })
            .entries(data);
	
		  //Dataset for graph 2 for filtering age
		  var nestedAge2 = d3.nest()	//Filter countries so each country has the average age of each position, used for filtering for each country from dropdown list
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
	
					
			//Dataset for graph 3
			var nestedData4 = d3.nest() //Create seperate datset for mean caps and mean age for each country
				.key(function(d){
					return d.team;
				})
				.rollup(function(leaves) {
					return {
						cap: d3.mean(leaves, function(e) { return e.Caps; }),
						age: d3.mean(leaves, function(e) { return e.age; })
					};
  				})
				.entries(data);
			console.log(nestedData4);



		//Sort datasets so it is displayed sorted by default
		nestedData.sort(function(a,b){
			return d3.descending(a.value,b.value)
		})

		nestedData2.sort(function(a,b){
			return d3.descending(a.value,b.value)
		})


	//Adjust height,width of chart 1
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

	
		//Adjust axis
		xScale1.domain([0,d3.max(nestedData,function(d)
				{
					return d.value;
				})])

		yScale1.domain(nestedData.map(function(d)
				{
					return d.key;
				}))

	  //ADJUST Height Width
	  mySVG
		.attr("width", width1 + margin1.left + margin1.right)
		.attr("height", height1 + margin1.top + margin1.bottom)
	  //Add and adjust axis
	  mySVG.append("g")
		.attr("transform",
			  "translate(" + margin1.left + "," + margin1.top + ")");
	  mySVG.append("g")
		.attr("transform", "translate(0," + height1 + ")")
		.call(d3.axisBottom(xScale1))
		.selectAll("text")
		  .attr("transform", "translate(-10,0)rotate(-45)")
		  .style("text-anchor", "end");

 	
		 //Make bar chart
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

		//Add label of each country to bar chart
		mySVG.selectAll(".label")
			.data(nestedData)
			.enter()
			.append("rect")
			.attr("x", xScale1(0) )
			.attr("y", function(d) { return yScale1(d.key); })
			.attr("width", function(d) { return xScale1(d.value); })
			.attr("height", yScale1.bandwidth() )
			.attr("fill", "pink")
			.attr('stroke', 'black')
			.on("mouseenter", function(d,i){ //ADD HOVER EFFECT, when we hover over total caps are displayed and color changes
				d3.select(this)
					.style("fill","#E75480")
				mySVG.append("text")
					.attr("class","tooltip")
					.attr("x",150)
					.attr("y",15+i*20)
					.text("Total Caps: "+d.value)
				})
			.on("mouseout",function(d){ //When we hover out of area it goes back to regular color and does not display total caps
				d3.select(this)
					.style("fill", "pink")

				d3.selectAll(".tooltip")
					.remove();
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


		// graph 3
		var width2 = 800;
		var height2 = 600;
		var margin2 = 100;

	
				
		
		mySVG3.attr("width", width2 + margin2)
			.attr("height", height2 + margin2);

		//we want the extent of all data, so we work with the un-nested data set
		var countryExtent = d3.extent(data, function(d){
										return d.team;
		})

		var xScale2 = d3.scaleTime()
							.domain(countryExtent)
							.range([0, width2]);

		//extraction of just the counts from the nested data
		var leafValues = new Array();
		nestedData4.forEach(function(d){	//countries
									leafValues.push(d.value);
		})
		console.log(leafValues);

		//so for cap counts by country extent, we work with the leafValues array
		var sumExtent = d3.extent(leafValues, function(d){
												return parseInt(d);
		})

		var yScale2 = d3.scaleLinear()
							.domain(sumExtent)
							.range([height2, 0]);

		var x_axis2 = d3.axisBottom(xScale2);
		var y_axis2 = d3.axisLeft(yScale2);

		mySVG3.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(" + margin2 +"," + height2 + ")")
			.selectAll("text")
				.style("text-anchor", "end")
				.attr("dx", "-.8em")
				.attr("dy", ".15em")
				.attr("transform", "rotate(-65)");

		mySVG3.append("g")
			.attr("class", "y axis")
			.attr("transform", "translate(" + margin2 + ",0)")
			.call(y_axis2);

		//define line generator
		var line = d3.line()
						.x(function(d){
							//x values on the line are defined by the xScale function
							return margin2 + xScale2(new team(d.key));
						})
						.y(function(d){
							//y values on the line are defined by the yScale function
							return yScale2(parseInt(d.cap));
		});

		var meanCap = nestedData4;
		console.log(meanCap)
		//var meanAge = nestedData4[1];

		//call line generator with the data for meanCap
		mySVG3.append("path")
				.datum(meanCap.values)
				.attr("class", "line meanCap")
				.attr("d", line);

		//call line generator with the data for meanAge
		//mySVG3.append("path")
		//		.datum(meanAge.values)
		//		.attr("class", "line meanAge")
		//		.attr("d", line);

		//mySVG3.selectAll(".circleAge")
		//		.data(meanAge.values)
		//		//.enter()
		//		.append("circle")
		//			.attr("class", "circleAge")
		//			.attr("cx", function(d){
		//						return margin2 + xScale2(new team(d.key));
		//			})
		//			.attr("cy", function(d){
		//						return yScale2(parseInt(d.value));
		//			})
		//			.attr("r", 2);

		mySVG3.selectAll(".circleCap")
				.data(meanCap.values)
				.enter()
				.append("circle")
					.attr("class", "circleCap")
					.attr("cx", function(d){
								return margin2 + xScale2(new team(d.key));
					})
					.attr("cy", function(d){
								return yScale2(parseInt(d.value));
					})
					.attr("r", 2);

			//Add title to plot
			mySVG3.append("text")
				.attr("x", width1-300)
				.attr("y",height1+60)
				.style("font-size", "25px")
				.text("Avg Caps and Age by Country");

	
		//Add dropdown list to filter based on country and populate drop down list
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
	
		//When we select a country we update the bar chart
		dropDownMenu
			.on("change",function(){
				var menuItem = d3.select(this)
					.property("value");
			if(menuItem != "All")
			{
				filterData(menuItem);
			}
			
		})
		//Add a button so we can both get the chart for average age and caps
		var myButton = d3.select("#ageButton")
		
		myButton	
			.on("click",function(){ //When it is lcicked we update the bar chart with new data either with avg age or avg caps then we filter the data based on the value in the drop downlist
			var changeChart = document.getElementById("dropDownList").value;	
			counter++; //TO make sure when clicked again that we differentiate between age and caps
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
		
		updateTimeline(nestedData2); //Default graph is avg caps for all countries
	

		updateTimeline(nestedData2);
		function filterData(country)
		{
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
		
		//THIS function draws the bar chart with the inserted data, data changes based on values selected from drop down list or if the button is pressed(avg age or avg cap)

		function updateTimeline(updatedData)
		{

			//For sorting, make better later
			updatedData.sort(function(a,b){
				return d3.descending(a.value,b.value)
			})


					
			//Set scales
			xScale.domain(updatedData.map(function(d)
			{
				return d.key;
			}))
			
			yScale.domain([0,d3.max(updatedData,function(d)
			{
				return d.value;
			})])
			
			//Bar chart has to be updated every time function is used so it is removed and constructed again with the new data
			mySVG2.selectAll(".bar")
				.remove();
			//Draw the chart
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

		
			//Add/Update title to plot and 
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
					.text("Average Age by Position");
			}
		}



})
