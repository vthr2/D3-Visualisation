
//What has been done are two graphs just to get started. It is quite ugly for now and many things have to be adjusted, no interactivity has been added
//THINGS TO FIX:
// 1. Make sizes of both graphs similar, second graph is way too large, also adjust positions of graphs
// 2. Add X-axis to first graph and a title
// 3. Pick different colors, so the position and first graph dont both have orange
// 4. Make code for first graph better by adding scales like was done in second graph

//THINGS THAT COULD BE ADDED TO MAKE GRAPHS BETTER, IDEAS
//1. Make a sorter to sort ascending descending
//2. Add a dropdown list so it is possible to both see graphs of total caps by positions and average caps by position, also possible for first graph
//3. Hover over charts to get values

var dataPath = "data/WorlCupSquadsInfoVis.csv"; //Datapath for data which will be read in

var mySVG = d3.select("#MySVG"); //First graph
var mySVG2 = d3.select("#MySVG2"); //Second graph
var margin = 80;					//Margin for second graph
var width = document.getElementById("MySVG2").clientWidth; 
var height = document.getElementById("MySVG2").clientHeight;
var categoricalScale = d3.scaleOrdinal(d3.schemeCategory10); //Colour palate


//Set scales for x and y
var xScale = d3.scaleBand()
				 .range([margin,width])
				 .padding(0.2);

var yScale = d3.scaleLinear()
			 .range([height-margin,0]);
	

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
		
		//Dataset for graph 2
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
	
	
		//Sort datasets so it is displayed sorted by default
		nestedData.sort(function(a,b){
			return d3.descending(a.value,b.value)
		})
	
		nestedData2.sort(function(a,b){
			return d3.descending(a.value,b.value)
		})
		//ADD RECTANGLES WITH WIDTH BASED ON SUM OF CAPS
		mySVG.selectAll("rect") 
		.data(nestedData)
		.enter()
		.append("rect")
			.attr("id","rect1")
			.attr("width",function(d){
				return d.value/4;	//DIVIDE BY 4 SO THE CHARTS DONT TAKE THE WHOLE SCREEN
			})
			.attr("height", 20)
			.attr("x", 50)
			.attr("y", function(d,i){
				return i*20;
			})
		//Add label of each country to bar chart
		mySVG.selectAll("text")
		.data(nestedData)
		.enter()
		.append("text")
			.attr("x", 55)
			.attr("y", function(d,i){
				return 15+i*20;
			})
			.text(function(d){
				return d.key;
		})


	
	
	
		//Make scales for second positions of footballers graph
		xScale.domain(nestedData2.map(function(d)
		{
			console.log(d.key)
			return d.key;
		}))
		yScale.domain([0,d3.max(nestedData2,function(d)
		{
			console.log(d.value)
			return d.value;
		})])
		mySVG2.selectAll(".bar")
			.data(nestedData2)
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
	
		//Add label for each position to bar chart
		mySVG2.selectAll("text")
			.data(nestedData2)
			.enter()
			.append("text")
				.attr("x", function(d){
						return xScale(d.key)+15;
					})
				.style("font-size", "50px")
				.attr("y",height-margin-15)
				.text(function(d){
					return d.key;
				})
		//Add Y-axis
		mySVG2.append("g")
			.attr("transform", "translate("+margin+ ",0)")
			.style("font-size","25px")
			.call(d3.axisLeft(yScale));
	

		//Add title to plot
		mySVG2.append("text")
			.attr("x", 135)             
			.attr("y", height-20)
			.style("font-size", "40px") 
			.text("Average Caps by Position");
	
})

