var airportMap = {};
// add a item
airportMap.ATL = 'ATL airport';
airportMap.LAX = "LAX airport";
airportMap.ORD = "ORD airport";
airportMap.DFW = "DFW airport";
airportMap.JFK = "JFK airport";
airportMap.DEN = "DEN airport";
airportMap.SFO = "SFO airport";
airportMap.LAS = "LAS airport";
airportMap.SEA = "SEA airport";
airportMap.PIT = "PIT airport";
airportMap.SJC = "SJC airport";

//This function is used to process the response from QPX Express Airfare API
function airfareResponse(responseJSON) {
    $("#loadingIcon").hide();
    var responseObject = JSON.parse(responseJSON);
    console.log(responseObject);
    var leng = responseObject.trips.tripOption.length, context = '<h3>Lowest Airfare Price from departure (PIT) to the recommended place (Fixed to Denver now) </h3><b>(Beta version: result won\'t change given different inputs for now)</b><br><br>';
    for ( i = 0; i < leng; i++) {
    context += '<li> Option ' + i + ': ' + responseObject.trips.tripOption[i].saleTotal + '</li>'
    }
    $(".response-area2").html(context);
}

//This function is used to initiate the CORS post request to QPX Express Airfare API
function airfareCall () {
    console.log("get into airfareCall");
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://www.googleapis.com/qpxExpress/v1/trips/search?key=AIzaSyD3eFiCwJPtgcaTbOE2Y4PWkL2FQqzWnQg',true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    console.log("xhr status before statechange " + xhr.status);

    xhr.send(JSON.stringify({
  "request": {
    "slice": [
      {
        "origin": "PIT",
        "destination": "DEN",
        "date": "2018-02-25"
      }
    ],
    "passengers": {
      "adultCount": 1,
      "infantInLapCount": 0,
      "infantInSeatCount": 0,
      "childCount": 0,
      "seniorCount": 0
    },
    "solutions": 2,
    "refundable": false
  }
}));
    xhr.onload = function() {
    // process the response.
     airfareResponse(xhr.responseText);
    };
    xhr.onerror = function() {
      console.log('There was an error!');
    };
}

//This function is used to process the response (JSONP) from http://iatacodes.org/ API
function JsonCallback(data) {
    var leng = data.response.length, context = '<h3>Some Possible Destinations for You</h3><b>(Beta version: result won\'t change given different inputs for now)</b><br><br>';
    for ( i = 0; i < leng; i++) {
    context += '<li>' + data.response[i].name + ' Airport (' + data.response[i].code + '), ' + data.response[i].country_name + '</li>'
	console.log(data.response[i]);
    }
    $(".response-area").html(context);
    
    //In the following version, the set of destinations are expected to be used to retrieve the air fare information from Google API
    //For now, I just assumes that Denver Airport is used to calculate the fare
    airfareCall();
}

//This function handles request to http://iatacodes.org/ API
function ajaxCallJsonp (target) {
    //The API provides information about airports given latitude, longtitude and distance(probably radius, unit)

    //TO BE COMPLETE : right now the latitude and longtitude are fixed. But in the complete version, this information is expected to be provided given the midpoint between two locations
    var data = $.getJSON(target,
    {
        lat: "41",
        lng: "-102",
        distance: "100"
    }, JsonCallback);
     
}

//This function is triggered when the search button is clicked. This function has two main functionalities, first is to check the inputs from the dropdown lists, second is to scroll down to the google map frame if the inputs are correctly selected.
function scrollToMap() {
    var place1 = $(".dropdown-toggle").first().text(), place2 = $(".dropdown-toggle").last().text();
    if (place1.search("Depart From") !== -1 || place2.search("Depart From") !== -1) {
    alert("At least one location is missing!");
        return;
    } else if (place1 === place2) {
        alert("Hey you guys actually depart from the same place?");
    } else {
        $("#loadingIcon").show();
        ajaxCallJsonp("https://iatacodes.org/api/v6/nearby.jsonp?&callback=?&api_key=f7d540ed-9d7c-4419-8f88-35d8bddbfc5d");
        mapReset(place1, place2);
        var targetOffset = $('#googleMapFrame').offset().top;
        $("html, body").animate({
        scrollTop: targetOffset + "px"
        }, 1000);

    }
    
}
//To make sure the scroll animation only happens after the google map is loaded
function searchFunctions () {
    $("#googleMapFrame").ready(scrollToMap);
}
function mapReset (p1, p2) {
    console.log(p1 + " " + p2);
    var prefix = "https://www.google.com/maps/embed/v1/directions?key=AIzaSyD3eFiCwJPtgcaTbOE2Y4PWkL2FQqzWnQg&origin=";
    var middle = "&destination=";
    var end = "&mode=flying";
    $("#googleMapFrame").attr('src', prefix + airportMap[p1] + middle + airportMap[p2] + end);
}
function changeButtonText() {
    var destination = this.value;
    $(this).parent().prev().text(destination);
}

$(document).ready(function () {
//    $("#loadingIcon").hide();
    $("#searchButton").on('click', searchFunctions);
    $(".dropdown-item").on('click', changeButtonText);
});