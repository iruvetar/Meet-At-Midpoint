//An array used by some of the functions below
var airportMap = [];
airportMap.push({key: "ATL", name: "ATL airport", lat: 33, long: -84});
airportMap.push({key: "LAX", name: "LAX airport", lat: 33, long: -118});
airportMap.push({key: "ORD", name: "ORD airport", lat: 41, long: -87});
airportMap.push({key: "DFW", name: "DFW airport", lat: 32, long: -97});
airportMap.push({key: "JFK", name: "JFK airport", lat: 40, long: -76});
airportMap.push({key: "DEN", name: "DEN airport", lat: 39, long: -104});
airportMap.push({key: "SFO", name: "SFO airport", lat: 37, long: -122});
airportMap.push({key: "LAS", name: "LAS airport", lat: 36, long: -115});
airportMap.push({key: "SEA", name: "SEA airport", lat: 47, long: -122});
airportMap.push({key: "PIT", name: "PIT airport", lat: 40, long: -80});
airportMap.push({key: "SJC", name: "SJC airport", lat: 37, long: -121});
//A variable stores the airport code for the recommended result
var destinationCode = '';

//This function is used to process the response from QPX Express Airfare API for the first route
function airfareResponse1(responseJSON) {
    var responseObject = JSON.parse(responseJSON);
//    var leng = responseObject.trips.tripOption.length
    var context = responseObject.trips.tripOption[0].saleTotal;
    
    var prefix = '<br><h3>Lowest One Way Price from ' + $(".dropdown-toggle").first().text() + ' to the recommended airport</h3><br>';
    prefix += context;
    $(".response-area2").first().html(prefix);
    
    //send request to get the lowest price for another route
    airfareCall2();
}
//This function is used to process the response from QPX Express Airfare API for the second route
function airfareResponse2(responseJSON) {
    var responseObject = JSON.parse(responseJSON);
//    var leng = responseObject.trips.tripOption.length
    var context = responseObject.trips.tripOption[0].saleTotal;
    
    var prefix = '<br><h3>Lowest One Way Price from ' + $(".dropdown-toggle").last().text() + ' to the recommended airport</h3><br>';
    prefix += context;
    $(".response-area2").last().html(prefix);
    //Hide the loading icon
    $("#loadingIcon").hide();
}

//This function is used to initiate the CORS post request to QPX Express Airfare API for the first route
function airfareCall1 () {
    //the places and date selected by the user
    var place1 = $(".dropdown-toggle").first().text(), date = $("#departDate-input").val();

    //for the Ajax request
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://www.googleapis.com/qpxExpress/v1/trips/search?key=AIzaSyD3eFiCwJPtgcaTbOE2Y4PWkL2FQqzWnQg',true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    

    var body = {
      "request": {
        "slice": [
          {
            "origin": place1,
            "destination": destinationCode,
            "date": date
          }
        ],
        "passengers": {
          "adultCount": 1,
          "infantInLapCount": 0,
          "infantInSeatCount": 0,
          "childCount": 0,
          "seniorCount": 0
        },
        "solutions": 1,
        "refundable": false
      }
    }
    xhr.send(JSON.stringify(body));
    xhr.onload = function() {
    // process the response.
     airfareResponse1(xhr.responseText);
    };
    xhr.onerror = function() {
      console.log('There was an error');
    };
}

//This function is used to process the response from QPX Express Airfare API for the second route
function airfareCall2 () {
    //the places and date selected by the user
    var place2 = $(".dropdown-toggle").last().text(), date = $("#departDate-input").val();

    //for the Ajax request
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://www.googleapis.com/qpxExpress/v1/trips/search?key=AIzaSyD3eFiCwJPtgcaTbOE2Y4PWkL2FQqzWnQg',true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    

    var body = {
      "request": {
        "slice": [
          {
            "origin": place2,
            "destination": destinationCode,
            "date": date
          }
        ],
        "passengers": {
          "adultCount": 1,
          "infantInLapCount": 0,
          "infantInSeatCount": 0,
          "childCount": 0,
          "seniorCount": 0
        },
        "solutions": 1,
        "refundable": false
      }
    }
    xhr.send(JSON.stringify(body));
    xhr.onload = function() {
    // process the response.
     airfareResponse2(xhr.responseText);
    };
    xhr.onerror = function() {
      console.log('There was an error');
    };
}

//This function is used to process the response (JSONP) from iatacode API
//url to the API: http://iatacodes.org/
function JsonCallback(data) {

    var result = findBestAirport(data);
    
    //if no previously selected (popular) airport around the midpoint, we don't go further to search for the airfare
    if (result[1].length === 0) {
        $("#loadingIcon").hide();
        $(".response-area").first().html('<b>We are sincerly sorry that we currently don\'t support any airport around the midpoint given your depart locations.</b><br><br>');
    } else {
        //update the first response area
        var context = '<br><h3>A Possible Destination for You</h3><br>';
        context += result[1];
        $(".response-area").first().html(context);
        //update the global variable
        destinationCode = result[0];
        //start request the airfare
        airfareCall1();
    }

}

// This function compares the airport list near the midpoint with selected airports defined in the beginning of this file, if there is a match, the specific airport is going to be the recommended destination.
function findBestAirport(data) {
    var leng = data.response.length, result = '';
    for ( i = 0; i < leng; i++) {
        for (j = 0; j < airportMap.length; j++) {
            if (data.response[i].code === airportMap[j].key) {
                result += '<li>' + data.response[i].name + ' Airport (' + data.response[i].code + '), ' + data.response[i].country_name + '</li>'
                return [data.response[i].code, result];
            }
        }
    }
    return [null, result];
}

//This function handles request to http://iatacodes.org/
//Tiss API provides information about airports given latitude, longtitude and distance
function ajaxCallJsonp (target, place1, place2) {
    //get the properties and values of the two airports
    let airport1 = airportMap.filter(function( obj ) {
	   return obj.key == place1;
    });
    let airport2 = airportMap.filter(function( obj ) {
	   return obj.key == place2;
    });
    
    //simply calculate the mid point
    let midLat = (airport1[0].lat + airport2[0].lat) / 2;
    let midLong = (airport1[0].long + airport2[0].long) / 2;
    
    //TO BE COMPLETE : right now the latitude and longtitude are fixed. But in the complete version, this information is expected to be provided given the midpoint between two locations
    var data = $.getJSON(target,
    {
        lat: midLat,
        lng: midLong,
        distance: "500"
    }, JsonCallback);
     
}


//This function will scroll down to the google map frame only when the inputs are correctly selected.
function scrollToMap() {
    var targetOffset = $('#googleMapFrame').offset().top;
    $("html, body").animate({
    scrollTop: targetOffset + "px"
    }, 1000);
    
}
//To make sure the scroll animation only happens after the google map is loaded
//This function has two main functionalities, first is to check the inputs from the dropdown lists, second .
function searchFunctions () {
    $("#googleMapFrame").ready(function(){
        var place1 = $(".dropdown-toggle").first().text(), place2 = $(".dropdown-toggle").last().text(), date = $("#departDate-input").val();
        if (date.length === 0) {
            alert("Please select the departure date.");
            return;
        } else {
            var dateObj = new Date(date);
            var today = new Date();
            if (dateObj.getTime < today.getTime) {
                alert("Sorry, please select a future date");
                return;
            }
        }
        if (place1.search("Depart From") !== -1 || place2.search("Depart From") !== -1) {
            alert("At least one location is missing.");
            return;
        } else if (place1 === place2) {
            alert("Do you guys really depart from the same place?");
        } else {
            mapReset(place1, place2);
            ajaxCallJsonp("https://iatacodes.org/api/v6/nearby.jsonp?&callback=?&api_key=f7d540ed-9d7c-4419-8f88-35d8bddbfc5d", place1, place2);
            $("#loadingIcon").show();
            scrollToMap();
        }
    });
}

//Reset the embedded google map based on the departure locations selected by users
function mapReset (p1, p2) {
//    console.log(p1 + " " + p2);
    var prefix = "https://www.google.com/maps/embed/v1/directions?key=AIzaSyD3eFiCwJPtgcaTbOE2Y4PWkL2FQqzWnQg&origin=";
    var middle = "&destination=";
    var end = "&mode=flying";
    $("#googleMapFrame").attr('src', prefix + p1 + ' airport' + middle + p2 + ' airport' + end);
}

//Update the text of the dropdown button as soon as the user selects the airport
function changeButtonText() {
    var destination = this.value;
    $(this).parent().prev().text(destination);
}

//A ajax function that sends request to my own server and retrieve the json content
function innerHttpRequest() {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange=function() {
        if (xhr.readyState == 4) {
            if(xhr.status == 200) {
                processInnerResponse(xhr.responseText);
            } else {
                responseArea.innerHTML="Error code " + xhr.status;
            }
        }
    }
    
    xhr.open("GET", "airports.json", true);
    xhr.send();
}
//Process the Json content stored in our own server
function processInnerResponse(responseJSON) {
    var responseAirports = JSON.parse(responseJSON);
    var displayText = "<br>These are the top 5 busiest airports in the United States. Thus they are included in the dropdown list you have seen on top of this page.<br><br><table class=\"table table-bordered\"><thead><tr><th>Rank<\/th><th>Name<\/th><th>Location<\/th><th># of Passengers in 2016<\/th><\/tr><\/thead>";

    for (var i = 0; i < responseAirports.Airport.length; i++) {
        var airport = responseAirports.Airport[i];
        displayText +="<tr>" + 
                        "<td>"+ airport.Rank + "<\/td>" + 
                        "<td>"+ airport.Name + "<\/td>" + 
                        "<td>"+ airport.City + ", " + airport.State + "<\/td>" +
                        "<td>"+ airport.Total_Passenger_2016 + "<\/td>" +
                      "<\/tr>";

    }
    displayText += "<\/table>";
    $(".response-area").last().html(displayText);
}


//Some event listeners
$(document).ready(function () {
    $("#loadingIcon").hide();
    $("#searchButton").on('click', searchFunctions);
    $(".dropdown-item").on('click', changeButtonText);
    $("#innerJsonButton").on('click', innerHttpRequest);
});