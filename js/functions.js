//When the user clicks on the timeline, show a tooltip above the clicked circle, and 
//the corresponding tweet in the timeline. 
//tooltip based on http://bl.ocks.org/d3noob/a22c42db65eb00d4e369
function timelineClick(d) {
    
    if(singleUser){
        var xShift = d.x+20;
        var yShift = d.y+20;

        div1.transition()		
            .duration(200)		
            .style("opacity", .8);		

        div1.html(d.text +  "<br/>"  + "<b>" + "Retweets: " + d.retweet_count +"</b>")	
            .style("left", xShift + "px")		
            .style("top", yShift + "px");
    }
}

function tweetClick(d) {
    if (singleUser) {

        var xShift = d.xcoord+40;
        var yShift = 25+(d.yaxis-1)*25;
        div2.transition()		
            .duration(200)		
            .style("opacity", .8);		

        div2.html(d.shortDate + "<br/>" + d.time)	
            .style("left", xShift + "px")		
            .style("top", yShift + "px");
    }
}

//When the user highlights a tweet, show a tooltip, and change the opacity of both
//the selected tweet and the corresponding timeline element.
function mouseHighlightTweet(d){
    
    var xShift = d.x+35;
    var yShift = d.y+20;
    
    div1.transition()		
        .duration(200)		
        .style("opacity", .8);		

    div1.html(d.text +  "<br/>"  + "<b>" + "Retweets: " + d.retweet_count +"</b>")	
        .style("left", xShift + "px")		
        .style("top", yShift + "px");


    var highlightedTweet = d3.select(this);
    
    highlightedTweet.style('fill', function(d){
       return d.color + '1)'})
    
    tweetId = highlightedTweet.attr('id');
    idConcat =  '#' + tweetId ;
    
    var circle = plot2.select(idConcat);

    circle.style('fill', function(d){
        return d.color + '1)'})
        .transition(100)
        .attr('r',20)
        .transition(100)
        .attr('r',10);

}

//when the mouse leaves the tweet, return to the normal display
function noMouseHighlightTweet(d){
    div1.transition()		
        .duration(500)		
        .style("opacity", 0);
    
    div2.transition()		
        .duration(500)		
        .style("opacity", 0);	
    
    var highlightedTweet = d3.select(this);
    
    highlightedTweet.style('fill', function(d){return d.color + d.alpha + ')'})
    
    tweetId = highlightedTweet.attr('id');
    idConcat =  '#' + tweetId ;
    
    var circle = plot2.select(idConcat);
    
    circle
        .transition(5000)
        .delay(500)
        .style('fill', function(d){return d.color + d.alpha+ ')'})
        .attr('r',5);
}


//similarly for tweets highlighted from the timeline    
function mouseHighlightTimeline(d){
    if(singleUser){
        
        var xShift = d.xcoord+40;
        var yShift = 25+(d.yaxis-1)*25;
        var circleSize = 8;

        div2.transition()		
            .duration(200)		
            .style("opacity", .8);		

        div2.html(d.shortDate + "<br/>" + d.time)	
            .style("left", xShift + "px")		
            .style("top", yShift + "px");


        var highlightedTime = d3.select(this);
 
        highlightedTime.style('fill', function(d){
           return d.color + '1)'})

        timelineId = highlightedTime.attr('id');
        idConcat =  '#' + timelineId ;

        //id given to the parent group that the circ + satellites are in - need to select circ inside it.
        var circleGroup = d3.select(idConcat);
        
        circleGroup.select('.circ').style('fill', function(d){
            return d.color + '1)'})
            .transition(100)
            .attr('r',15)
            .transition(100)
            .attr('r',circleSize);
    }

}

function noMouseHighlightTimeline(d){
    if (singleUser){

        div1.transition()		
            .duration(500)		
            .style("opacity", 0);

        div2.transition()		
            .duration(500)		
            .style("opacity", 0);	

        var highlightedTime = d3.select(this);

        highlightedTime.style('fill', function(d){return d.color + d.alpha + ')'})

        timelineId = highlightedTime.attr('id');
        idConcat =  '#' + timelineId ;

        var circleGroup = d3.select(idConcat);
        
        circleGroup.select('.circ')
            .transition(5000)
            .delay(500)
            .style('fill', function(d){return d.color + d.alpha+ ')'});

    }
}

//when the user inputs a new username into the New User box, query the Twitter API and 
//reload with the new data
function reloadData(inputName){
    
    if (singleUser) {

            if (inputName[0] == '@'){
                
            }
                //add an @ symbol, if the user didn't
                else {
                    inputName = '@' + inputName;
                }

                plot1.selectAll("*").remove();
                plot2.selectAll("*").remove();
                sidebarPlot.selectAll("*").remove();
                userPlot.selectAll("*").remove();
                tweetInterval = 0;

                //load this link to call data live from Twitter
                //http://ericagunn.com/Twitter/TwitterDataAppAnyUser.php?screen_name=engunneer&count=100
                d3.json('http://ericagunn.com/Twitter/TwitterDataAppAnyUser.php?screen_name=' + inputName + '&count=100', function(error, data){
                    parse(data);
                });
    }     
    
}

//runs during the force layout to perform the minimization (after data is bound to the layout - 
//separate from the pre-minimization done in the bubbles function)
function tick(e,twitterData,plotHandle){
    
        var twitterData = twitterData;
    
        circleGroups = d3.selectAll('.circ-group');

        //call the collision function, pass it a value of alpha, beginning where pre-min left off
        if (singleUser) {
            circles = plot1.selectAll('.circ');
            circles.each(collide(.045));
        }
    
        //keep track of which plot you're drawing to (necessary for the multi-panel display)
        var plotTracker = 0;
    
        if (!singleUser) {
            //stop the force layout if alpha is small (not sure why this needs to run at all, since 
            //pre-min should have taken care of it, but it does.) Set empirically, to create static images
            //quickly in the smaller displays
            if(force.alpha() <= 0.095){
                force.stop();
            }
            
            if (circle1 & circle2) {
                circle3 = plotHandle.selectAll('.circ');
                circle3.each(collide(.045));
                plotTracker = 3;
            }
            else if(circle1) {
                circle2 = plotHandle.selectAll('.circ');
                circle2.each(collide(.045));
                plotTracker = 2;
            }
            else {
                circle1 = plotHandle.selectAll('.circ');
                circle1.each(collide(.045));
                plotTracker = 1;
            }
        }

        //check whether the sort selection button has been pushed (single user mode only)
        //and choose the gravity function accordingly.
        if (!multiGravityOn){
            if(singleUser){
                circles.each(gravity(.01));
            }
            else {
                if (plotTracker == 3) {
                    circle3.each(gravity(.15));
                }
                else if(plotTracker == 2) {
                    circle2.each(gravity(.15));
                }
                else {
                    circle1.each(gravity(.15));
                }

            }
        }

        else if (multiGravityOn){
            circles.each(multiGravity(.01));
        }

        //move the groups to their new positions
        circleGroups.each(function(d,i){
            d3.select(this).attr('transform', 'translate(' + d.x + ',' + d.y + ')');
        })

        //gravity functions attract circles to the center of the screen.
        function gravity(k){  

            //custom gravity: data points gravitate towards a straight line
            return function(d){
                d.y += (height1/2 - d.y)*k;
                d.x += (d.xPos*.5 + width1/4 - d.x)*k;//(d.xPos - d.x)*k;
            }
        }

        function multiGravity(k){
            //set up a different gravity for each type of tweet    
            return function(d){
                var focus = {};

                if (d.text.substring(0,2)== "RT"){
                    focus.x = width1/3 - width1/6;
                }
                //should be @username for a reply or direct message
                else if (d.text.substring(0,1) == "@"){
                    focus.x = width1/2;
                }
                //should be nothing for fresh tweet
                else {
                    focus.x = (2*width1)/3+width1/6;
                }

                focus.y = height1/2;

                d.y += (focus.y - d.y)*k;
                d.x += (focus.x - d.x)*k;
            }
        }

//collision function checks for overlaps and moves circles apart if they collide
//from http://bl.ocks.org/mbostock/1804919
function collide(alpha){

    var quadtree = d3.geom.quadtree(twitterData);
    return function(d) {
        var r = d.r + 15,
            nx1 = d.x - r,
            nx2 = d.x + r,
            ny1 = d.y - r,
            ny2 = d.y + r;

    //check each circle using the quadtree function, return new positions  
    quadtree.visit(function(quad, x1, y1, x2, y2) {
        if (quad.point && (quad.point !== d)) {
            var x = d.x - quad.point.x,
                y = d.y - quad.point.y,
                l = Math.sqrt(x * x + y * y);
            if (singleUser) {
                r = d.r + quad.point.r + (circleSize*2+4); //sets the space to leave around the circle
            }
            else {
                r = d.r + quad.point.r + (circleSize*7);
            }
            if (l < r) {
                l = (l - r) / l * alpha;
                d.x -= x *= (l*.3);
                d.y -= y *= (l*.3);
                quad.point.x += x;
                quad.point.y += y;
            }
        }
      return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
    });
  };

}
    
}


