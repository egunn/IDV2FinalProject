//draws force layout to the canvas. Central circles are colored according to tweet type,
//satellite circles represent the number of retweets.
function bubbles(twitterData, plotHandle){
    
    //make empty selection, bind groups to twitterData, give them random positions
    var circles = plotHandle.selectAll('.circ')
        .data(twitterData)
        .enter()
        .append('g')
        .attr('class',"circ-group")
        .attr('id',function(d,i){return String('circle-' + i)})
        .attr('transform', function (d) { 
                
            xPos = Math.random()*width1;
            if(xPos>width1-circleSize){ 
                xPos -= circleSize;
            } 
            else if(xPos< -xPos>width1-circleSize) {
                xPos += xPos>width1-circleSize;
            }

            //write xPos to the bound object for later use
            d.x=xPos;
            d.xPos = xPos;
     
            yPos = Math.random()*height1
            if(yPos>height1-circleSize){
                yPos -= circleSize;
            } 
            else if(yPos< circleSize) {
                yPos += circleSize;
            }

            //write xPos to the bound object for later use
            d.y=yPos;
            d.yPos = yPos;
            
            return  'translate('+ xPos + ',' + yPos + ')'; 
    });
    
    //set circle size, read tweet content to determine which color to assign
    circles
        .append('circle')
        .attr('class','circ')
        .attr('cx',0)
        .attr('cy',0)
        .attr('r', function(d){
            d.r = circleSize;
            return circleSize})
        .style('fill', function(d){
            //use substring(0,x) to get first few letters of each tweet.
            //should be RT for retweet
            if (d.text.substring(0,2)== "RT"){
                var color = 'rgba(102, 0, 102,' 
                var alpha = .5;
                d.alpha = alpha;
                d.color = color;
                return color + alpha+')';
            }
            //should be @username for a reply or direct message
            else if (d.text.substring(0,1) == "@"){
                var color = 'rgba(0, 179, 179,'
                var alpha = .5;
                d.alpha = alpha;
                d.color = color;
                return color + alpha+')';
            }
            //should be nothing for fresh tweet
            else {
                var color = 'rgba(255, 140, 26,'
                var alpha = .5;
                d.alpha = alpha;
                d.color = color;
                return color + alpha+')';
            }

        })
        .call(force.drag) //allow the user to drag circles with the mouse
        
        
    //check whether the function is running in sketch 1 or sketch 1b.
    if (singleUser) {
        //set mouse behavior - highlight on mouseover, show tooltip on click.
        circles
            .on("mouseover", mouseHighlightTweet)					
            .on("mouseout", noMouseHighlightTweet)
            .on('click', tweetClick);
    }
    
    //from: http://stackoverflow.com/questions/13463053/calm-down-initial-tick-of-a-force-layout
    //run the force layout without drawing (must be done before binding to the data) to reduce 
    //computation time. 
    var safety = 0;
    while(force.alpha() > 0.045) { // threshold alpha data where you want to return to "normal" minimization
        force.tick();
        if(safety++ > 500) {
          break;// Avoids infinite looping 
    }
    }
    

    //set up force layout, bind to data, run tick function to update
    force.nodes(twitterData)
        .on('tick',function(e){ tick(e,twitterData,plotHandle);})
        .start();
    
    //create empty storage array for satellite circles, and set a counter variable
    var satNodes = [];
    var numSats = null;

    //based on http://jsfiddle.net/nrabinowitz/5CfGG/
    //and http://bl.ocks.org/milroc/4254604
    circles.each(function(d,index){
         
            //select the current circle in the .each loop, append a group to it.
            var satGroup = d3.select(this).append('g').attr('class','sat-group');
        
            //create a blanks to fill
            satellites = [];
            dataTree={};
            
            //create a satellite circle for each retweet
            for (var i = 0; i<d.retweet_count; i++){
                numSats = d.retweet_count;
                
                satellite = {parentX:d.x, parentY:d.y, retweets:d.retweet_count, parentR:d.r}
                satellites.push(satellite);
            }
            
            //make a tree layout to hold the satellites
            if(satellites.length > 0){ 
            
                var dataTree = {
                     //take the satellites array, and map each entry onto a function that returns
                     //the length of the array, so that each satellite child object knows how many
                     //siblings it has.
                     children: []
            };    
                
            for (var j=0; j<satellites.length;j++){
                //map satellite data to a tree
                dataTree.children.push({size: satellites.length})

            }
                
            //object with the children array inside it. Children array is an array of child objects, 
            //each with a size attribute.
                             
            }
         
            tree = null;
        
            //if there is a dataTree for a circle, make a treemap layout 
            if(dataTree != {}){
                // make a radial tree layout
                tree = d3.layout.tree()
                    //x controls length (360 for radial degrees. y controls radial distance. 
                    //Node size is set when circles are drawn, below.
                    .size([360*4,circleSize]); 
                
                //apply the layout to the data
                satNodes = tree.nodes(dataTree);

            }
            
      
                //create empty selection to append satellites into
                var satNode = satGroup.selectAll(".node");
        
                var nodes = satNode.data(satNodes.slice(1)) // cut out the root node, we don't need it
                      .enter()
                      .append("g")
                      .attr("class", "node")
                      .attr("transform", function(d,i) {                    
                          //draw the satellite nodes around the center and translate to the 
                          //appropriate radial distance. (Empirically determined, uses thresholds
                          //to deal with unexpectedly large numbers)
                                                    
                          if (numSats<200){
                              return "rotate(" + (d.x) + ") translate(" + ((circleSize +circleSize/4) + (i*.05)) + ")";
                          }
                          else if (numSats<500){
                              return "rotate(" + (d.x*10) + ") translate(" + ((circleSize +circleSize/4) + (i*.05)) + ")";
                          }
                          else {
                              if(singleUser){
                                  return "rotate(" + (d.x*15*circleSize/2) + ") translate(" + ((circleSize +circleSize/4) + 
                                    (i*.01)) + ")";
                              }
                              else{
                                  return "rotate(" + (d.x*15*circleSize/4) + ") translate(" + ((circleSize +circleSize/4) + 
                                    (i*.01*circleSize/64)) + ")";
                              }
                          }

                      });
                      
                //actually append the satellite nodes
                nodes.append("circle")
                    .attr("r", circleSize/12)
                    .style("fill",'rgba(95, 95, 95, .7)'); 


                
                
    }) 
    
}