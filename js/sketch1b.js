//sets up multiple user page, runs when sketch1b loaded

//set some margins and record width and height of window
var margin = {t:25,r:10,b:25,l:10};

var userWidth = document.getElementById('user1').clientWidth - margin.r - margin.l,  
    userHeight = document.getElementById('user1').clientHeight - margin.t - margin.b;

var width1 = document.getElementById('plot1').clientWidth - margin.r - margin.l,  
    height1 = document.getElementById('plot1').clientHeight - margin.t - margin.b;

var width2 = document.getElementById('timeline1').clientWidth - margin.r - margin.l,  
    height2 = document.getElementById('timeline1').clientHeight - margin.t - margin.b;

var multiGravityOn = false;
var circleSize = 4;
var singleUser = false;
var circle1 = null;
var circle2 = null;
var circle3 = null;


//select the HTML plot element by class
var userCanvas1 = d3.select("#user1");

//select the HTML plot element by class
var timelineCanvas1 = d3.select("#timeline1");

//select the HTML plot element by class
var plotCanvas1 = d3.select("#plot1");


//select the HTML plot element by class
var userCanvas2 = d3.select("#user2");

//select the HTML plot element by class
var timelineCanvas2 = d3.select("#timeline2");

//select the HTML plot element by class
var plotCanvas2 = d3.select("#plot2");


//select the HTML plot element by class
var userCanvas3 = d3.select("#user3");

//select the HTML plot element by class
var timelineCanvas3 = d3.select("#timeline3");

//select the HTML plot element by class
var plotCanvas3 = d3.select("#plot3");

//create force layout, give charge and gravity
var force = d3.layout.force()
    .size([width1,height1])
    .charge(0)
    .gravity(0.001);


userPlot1 = userCanvas1.append('svg')
    .attr('width',userWidth+margin.r+margin.l)
    .attr('height',userHeight + margin.t + margin.b)
    .append('g')
    .attr('class','userCanvas')
    .attr('transform','translate('+margin.l+','+margin.t+')');

//note: currently using userWidth and Height - if divs change ratio, will need to update!
timelinePlot1 = timelineCanvas1.append('svg')
    .attr('width',width2+margin.r+margin.l)
    .attr('height',height2 + margin.t + margin.b)
    .append('g')
    .attr('class','timelineCanvas')
    .attr('transform','translate('+margin.l+','+margin.t+')');

plot1 = plotCanvas1.append('svg')
    .attr('width',width1+margin.r+margin.l)
    .attr('height',height1 + margin.t + margin.b)
    .append('g')
    .attr('class','canvas1')
    .attr('transform','translate('+margin.l+','+margin.t+')');


userPlot2 = userCanvas2.append('svg')
    .attr('width',userWidth+margin.r+margin.l)
    .attr('height',userHeight + margin.t + margin.b)
    .append('g')
    .attr('class','userCanvas')
    .attr('transform','translate('+margin.l+','+margin.t+')');

//note: currently using userWidth and Height - if divs change ratio, will need to update!
timelinePlot2 = timelineCanvas2.append('svg')
    .attr('width',width2+margin.r+margin.l)
    .attr('height',height2 + margin.t + margin.b)
    .append('g')
    .attr('class','timelineCanvas')
    .attr('transform','translate('+margin.l+','+margin.t+')');

plot2 = plotCanvas2.append('svg')
    .attr('width',width1+margin.r+margin.l)
    .attr('height',height1 + margin.t + margin.b)
    .append('g')
    .attr('class','canvas1')
    .attr('transform','translate('+margin.l+','+margin.t+')');




userPlot3 = userCanvas3.append('svg')
    .attr('width',userWidth+margin.r+margin.l)
    .attr('height',userHeight + margin.t + margin.b)
    .append('g')
    .attr('class','userCanvas')
    .attr('transform','translate('+margin.l+','+margin.t+')');

//note: currently using userWidth and Height - if divs change ratio, will need to update!
timelinePlot3 = timelineCanvas3.append('svg')
    .attr('width',width2+margin.r+margin.l)
    .attr('height',height2 + margin.t + margin.b)
    .append('g')
    .attr('class','timelineCanvas')
    .attr('transform','translate('+margin.l+','+margin.t+')');

plot3 = plotCanvas3.append('svg')
    .attr('width',width1+margin.r+margin.l)
    .attr('height',height1 + margin.t + margin.b)
    .append('g')
    .attr('class','canvas1')
    .attr('transform','translate('+margin.l+','+margin.t+')');

//reset userInput variable
var userInput = null;

//Get the list of users input in sketch1 from the server
d3.json("http://ericagunn.com/Twitter/getFromPHP.php", function(error, fromPHP) {

    //ask the server for names input from user
    userInput = fromPHP;

    
//if the user has entered data, use it to query the Twitter API
//dynamic queue from http://stackoverflow.com/questions/21687230/dynamically-change-the-number-of-defer-calls-in-queue-js
//use this to load one file for each username that the user entered into the form - between 1 and 3
var q = queue();
if (userInput){
    for (var i = 0; i < userInput.length; i++){
        if (userInput[i] != "undefined"){
            q = q.defer(d3.json, 'http://ericagunn.com/Twitter/TwitterDataAppAnyUser.php?screen_name=' + userInput[i] + '&count=100');
        }
    }
}

//tell queue when it's done. Use the arguments parameter to find out how many datasets should be loading    
q.await(function(error){
    
    if(!error){
    
        if (arguments.length == 2){
            var userData1 = arguments[1];
            
            var twitterData1 = parse(userData1);
            twitterData1.legend = true;
                      
            drawWindow(twitterData1);
    
        }
        if (arguments.length == 3){
            var userData1 = arguments[1];
            var userData2 = arguments[2];
            
            var twitterData1 = parse(userData1);
            var twitterData2 = parse(userData2);
            
            twitterData1.legend = true;
            
            drawWindow(twitterData1,twitterData2);
        }
        if (arguments.length == 4){
            var userData1 = arguments[1];
            var userData2 = arguments[2];
            var userData3 = arguments[3];
            
            var twitterData1 = parse(userData1);
            var twitterData2 = parse(userData2);
            var twitterData3 = parse(userData3);
            
            twitterData1.legend = true;
            
            drawWindow(twitterData1,twitterData2,twitterData3);
        }
        
    }
});
    
})

//draw the legend for the multiple user screen
function drawLegend(){
                 
        var timeline = d3.select('#timeline1');
    
        legend = timeline.select('svg')
            .append('g')
            .attr('class', 'legend');
    
         legend.append('circle')
            .attr('cx',80).attr('cy',5).attr('r',5).style('fill','rgba(102, 0, 102,.6)').attr('class','legendCircle'); 
         legend.append('text').attr('class','legendLabel-retweet legendLabel')
            .attr('x',88).attr('y',8).text("retweet");

         legend.append('circle')
            .attr('cx',160).attr('cy',5).attr('r',5).style('fill','rgba(0, 179, 179,.6)').attr('class','legendCircle');
         legend.append('text').attr('class','legendLabel-reply legendLabel')
            .attr('x',168).attr('y',8).text("@reply");

         legend.append('circle')
            .attr('cx',240).attr('cy',5).attr('r',5).style('fill','rgba(255, 140, 26,.6)').attr('class','legendCircle');
         legend.append('text').attr('class','legendLabel-new legendLabel')
            .attr('x',248).attr('y',8).text("new tweet");

         legend.append('circle')
            .attr('cx',320).attr('cy',5).attr('r',2).style('fill','rgba(95, 95, 95, .7)').attr('class','legendCircle legendCircle-satellite');
         legend.append('text').attr('class','legendLabel-satellite legendLabel')
            .attr('x',325).attr('y',8).text("# retweets");  
   
}
    

//sort the tweets in date order
function parse(data){
    
    if (data.error == 'Not authorized.'){
        return;
    }
    else {
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

        return(sortedTweets);
    }
}


