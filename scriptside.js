
var dataPath = "data/WorlCupSquadsInfoVis.csv"; //Datapath for data which will be read in



d3.csv(dataPath) //Read in Data
    .then(function(data){
        //console.table(data);
        //console.log(data);
        
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
	

	d3.select("svg")	//ADD RECTANGLES WITH WIDTH BASED ON SUM OF CAPS
		.selectAll("rect") 
		.data(nestedData)
		.enter()
		.append("rect")
			.attr("width",function(d){
				return d.value/4;	//DIVIDE BY 4 SO THE CHARTS DONT TAKE THE WHOLE SCREEN
			})
			.attr("height", 20)
			.attr("x", 50)
			.attr("y", function(d,i){
				return i*20;
			})
	
	d3.select("svg")//ADD LABELS FOR COUNTRY TO CHART
		.selectAll("text")
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
	
})

