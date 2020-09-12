/* Values*/

//position
let lat;
let long;

//use 24h 
const twentyFour = true; 

//percent of bar used
let totalPercent = 0.0;
let barValue = 0;

//colors
const colors = ["Black","MidnightBlue","CornflowerBlue","Gold","Gold","CornflowerBlue","MidnightBlue","Black"]

//time keys and values
let times = new Map();
/* ------ */

/*
Function Calls 
    -Calls the functions for intializing page
*/
function functionCalls(){
    initPage();
    initTimes();
    times.forEach(formatMinutes);
    times.forEach(createSegment);   

}
/* ------ */

/*
Initializing Page
    -getCoords
    -Create Major Page Elements
    -Calculate sun data
*/
function getCoords(){
    console.log("getting coords...")
        if (navigator.geolocation) {
            console.log("found geolocator...")
            navigator.geolocation.getCurrentPosition(
                function(pos){
                    console.log(`coords ${pos.coords.latitude} , ${pos.coords.longitude}`);

                    //set coords from navitation data
                    lat = pos.coords.latitude;
                    long = pos.coords.longitude;

                    //round values
                    lat = Math.round(lat, 5);
                    long = Math.round(long, 5);

                    console.log("lat: " + lat);
                    console.log("long: " + long);

                    document.getElementById("getLocBtn").remove();
    
                    document.getElementById("latLongLabel").style.display = "block";

                    //call golden hour functions
                    functionCalls();
                },
                function(){console.log("error!");  }
            );
        }
}

function initPage(){
    console.log("innit page")
    document.getElementById("lat").innerHTML = lat;
    document.getElementById("long").innerHTML = long;
}

function initTimes(){
    /*
    uses SUNCALC to generate times
    populates times map with data
    */

    var timeData = SunCalc.getTimes(new Date(), lat, long);
    console.log(timeData);

    times.set('Day Start', { hour: 0, minute: 0})

    var blueHourAM_H = timeData.dawn.getHours();
    var blueHourAM_M = timeData.dawn.getMinutes();
    times.set('Morning Blue Hour', { hour: blueHourAM_H, minute: blueHourAM_M })


    var goldenHourAM_H = timeData.goldenHourEnd.getHours();
    var goldenHourAM_M = timeData.goldenHourEnd.getMinutes();
    times.set('Morning Golden Hour', { hour: goldenHourAM_H, minute: goldenHourAM_M })

    var noon_H = timeData.solarNoon.getHours();
    var noon_M = timeData.solarNoon.getMinutes();
    times.set('Solar Noon', { hour: noon_H, minute: noon_M })

    var goldenHourPM_H = timeData.goldenHour.getHours();
    var goldenHourPM_M = timeData.goldenHour.getMinutes();
    times.set('Evening Golden Hour', { hour: goldenHourPM_H, minute: goldenHourPM_M })

    var blueHourPM_H = timeData.dusk.getHours();
    var blueHourPM_M = timeData.dusk.getMinutes();
    times.set('Evening Blue Hour', { hour: blueHourPM_H, minute: blueHourPM_M })

    times.set('Day End', { hour: 24, minute: 0})
}

/* ------ */

/*
Creating Timeline 
    -calculates and prints elements of the time line
*/

function createSegment(value, key){
    /* 
    adds a bar, title, and time
    */
    let percent = calcPercent(value, key);
    
    printBar(percent);
    printTitle(key);
    printTime(value);
    barValue++;
}

function calcPercent(value){
    let percent_H = Math.round(value.hour/24 * 100);

    let percent_M = Math.round(value.minute/60*100);

    let percent = percent_H + '.' + percent_M;
    //console.log("percent: " + percent);

    return percent;
}

function printTitle(key){
    let newTitle = document.createElement("h2");
    newStr = document.createTextNode(key);
    newTitle.append(newStr);
    newTitle.style.fontWeight = 'bold';
    //set container
    var container = document.getElementById("timeline");
    container.insertAdjacentElement('beforeend', newTitle);
}

function printTime(value){
    let newTitle = document.createElement("h2");
    newStr = document.createTextNode(value.hour + ":" + value.minute);
    newTitle.append(newStr);
    //set container
    var container = document.getElementById("timeline");
    container.insertAdjacentElement('beforeend', newTitle);
}

function printBar(size){
     /*
    -creates a colored div segment for each period of time
    */

    let unit = "rem";

    //calculate the width of div based on time
    size = Math.round(size - totalPercent);
    //console.log("Corrected width: " + width);

    totalPercent += size;
    var sizeStr = size + unit;

    //create a new segment 
    //with a class of timlineBarSegment
    var newSegment = document.createElement("div");
    newSegment.setAttribute("class", "gh-bar");

    //styles
    newSegment.style.backgroundColor = colors[barValue];
    console.log("Bar: " + barValue + " | Size: " + sizeStr);

    //!!!
    newSegment.style.height = sizeStr;
    //newSegment.style.width = sizeStr;
    //!!!

    //set container
    var container = document.getElementById("timeline");
    container.insertAdjacentElement('beforeend', newSegment);

    console.log("bar printed");
}

function formatMinutes(value, key){
    /*
    -adds zero to single digit minutes
    -console.logs values
    */
    if(value.minute < 10)
        value.minute = "0" + value.minute;

    console.log(key + ' - ' + value.hour + ":" + value.minute);
}
/* ------ */



