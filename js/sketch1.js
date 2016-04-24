//runs on page load for sketch1 - main page, showing data for a single user

//div is in html, when page loads, get window height and width, and adjust div height and width according to that using JS.

//set some margins and record width and height of window
var margin = {t:25,r:40,b:25,l:40};

var userWidth = document.getElementById('user').clientWidth - margin.r - margin.l,  
    userHeight = document.getElementById('user').clientHeight - margin.t - margin.b;

var width1 = document.getElementById('plot1').clientWidth - margin.r - margin.l,  
    height1 = document.getElementById('plot1').clientHeight - margin.t - margin.b;

var width2 = document.getElementById('plot2').clientWidth - margin.r - margin.l,  
    height2 = document.getElementById('plot2').clientHeight - margin.t - margin.b;

var multiGravityOn = false;
var circleSize = 8;
var singleUser = true;

//select the HTML plot element by class
var userCanvas = d3.select(".user");

//select the HTML plot element by class
var sidebarCanvas = d3.select(".sidebar");

//select the HTML plot element by class
var canvas1 = d3.select(".plot1");

//select the HTML plot element by id 
var canvas2 = d3.select(".plot2");

//create force layout, give charge and gravity
var force = d3.layout.force()
    .size([width1,height1])
    .charge(-5)
    .gravity(0.05)
    .alpha(.1);


// Define the div for the tooltip
var div1 = d3.select(".plot1").append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0);

// Define the div for the tooltip
var div2 = d3.select(".plot2").append("div")	
    .attr("class", "tooltip")
    .style("width","100px")
    .style("opacity", 0);

userPlot = userCanvas.append('svg')
    .attr('width',userWidth+margin.r+margin.l)
    .attr('height',userHeight + margin.t + margin.b)
    .append('g')
    .attr('class','userCanvas')
    .attr('transform','translate('+margin.l+','+margin.t+')');

//note: currently using userWidth and Height - if divs change ratio, will need to update!
sidebarPlot = sidebarCanvas.append('svg')
    .attr('width',userWidth+margin.r+margin.l)
    .attr('height',userHeight + margin.t + margin.b)
    .append('g')
    .attr('class','sidebarCanvas')
    .attr('transform','translate('+margin.l+','+margin.t+')');

plot1 = canvas1.append('svg')
    .attr('width',width1+margin.r+margin.l)
    .attr('height',height1 + margin.t + margin.b)
    .append('g')
    .attr('class','canvas1')
    .attr('transform','translate('+margin.l+','+margin.t+')');

plot2 = canvas2.append('svg')
    .attr('width',width2+margin.r+margin.l)
    .attr('height',height2 + margin.t + margin.b)
    .append('g')
    .attr('class','canvas2')
    .attr('transform','translate('+margin.l+','+margin.t+')');

//load pre-stored data to start 
d3.json("./AmandaPalmer_0320_100timeline.json", function(error, data) {
    
    //load this link to call data live from Twitter
    //http://ericagunn.com/Twitter/TwitterDataAppAnyUser.php?screen_name=engunneer&count=100
    
    parse(data);
})

//sort tweets by date
function parse(data){
    
    var parsedTweets = [];
    
    //converts Twitter date to Unix Epoch time (ms since Jan 1, 1970)
    //date is originally formatted in UTC time.
    data.forEach(function(d){
        var dateParse = Date.parse(d.created_at); 
        d.parsedDate = dateParse;
        parsedTweets.push(d);
    })
    
    var sortedTweets = parsedTweets.sort(function(tweetA,tweetB){
        //sorts in date order
        return tweetA.parsedDate - tweetB.parsedDate;
    })

    drawWindow(sortedTweets);
    
}


//load sketch page
function multUsers(userInput){
    window.location = "../sketch1b.html";
}


//Change gravity functions and animate legend items when Separate Categories button is pushed
function mouseClickCategories(twitterData) {
    if (multiGravityOn == true){
        multiGravityOn = false;
        
        sidebarData.select('.multi-toggle')
            .text('Separate Categories');
        
        plot1.select('.legendLabel-reply')
            .transition(100)
            .style('font-size',10)
            .attr('text-align','left')
            .attr('x',-5)
            .attr('y',18);
        
        plot1.select('.legendLabel-retweet')
            .transition(100)
            .style('font-size',10)
            .attr('text-align','left')
            .attr('x',-5)
            .attr('y',33);
        
        plot1.select('.legendLabel-new')
            .transition(100)
            .style('font-size',10)
            .attr('text-align','left')
            .attr('x',-5)
            .attr('y',48);
        
        plot1.selectAll('.legendCircle')
            .transition(100)
            .attr('r',5);
        
        plot1.select('.legendCircle-satellite')
            .transition(100)
            .attr('r',2);
        
        plot1.select('.legendLabel-satellite')
            .transition(100)
            .style('fill','darkgray');
  
    }
    
    else if (multiGravityOn == false){
        multiGravityOn = true;
        
        sidebarData.select('.multi-toggle')
            .text('Mix all Categories');
        
        plot1.select('.legendLabel-reply')
            .transition(100)
            .style('font-size',14)
            .attr('text-align','middle')
            .attr('x',width1/3 - width1/6-25)
            .attr('y',18);
        
        plot1.select('.legendLabel-retweet')
            .transition(100)
            .style('font-size',14)
            .attr('text-align','middle')
            .attr('x',width1/2-25)
            .attr('y',18);
        
                
        plot1.select('.legendLabel-new')
            .transition(100)
            .style('font-size',14)
            .attr('text-align','middle')
            .attr('x',(2*width1)/3+width1/6-25)
            .attr('y',18);
        
        plot1.selectAll('.legendCircle')
            .transition(100)
            .attr('r',0);
        
        plot1.select('.legendLabel-satellite')
            .transition(100)
            .style('fill','none');
    
    }


}


