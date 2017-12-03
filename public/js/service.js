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

//This function is used to validate the input information before submit the parameters to the controller
//The validation check point includes date check because google QPX API will cause problem when the date is older than current date
//Another validation check point is to check whether the input is a valid name of an airport
//To avoid the word matching complexity, I simply force the user to select the airport from the autocomplete dropdown list
function validateForm() {
    //Get value from html
    var place1 = $("#depart1").val(), place2 = $("#depart2").val(), date = $("#departDate").val();
    
    //Validate date
    if (date == "") {
        alert("Please select a future date.");
        return false;
    }
    //Create a date object
    var d = new Date(date);
    var today = new Date();
    
    //Validate date
    if (d.getTime() < today.getTime()) {
        alert(`The date must be a future date.
For your reference, today is ${today}.`);
        return false;
    } else {
        //Date is validated, check input airports
        if (validateAirport(place1) == false || validateAirport(place2) == false) {
            alert("Please select the airport from the dropdown list provided.");
            return false;
        }
    }
    
    return true;
}

function validateAirport(str) {
    for (let i = 0; i < availableAirports.length; i++) {
        if (str === availableAirports[i]) {
            return true;
        }
    }
    return false;
}
//Some event listeners
$(document).ready(function () {
    $("#loadingIcon").hide();
//    $("#searchButton").on('click', searchFunctions);
    //Autocomplete
    $(".airportSelect").autocomplete({
        source: availableAirports
    });
});

var availableAirports = [
    "Hartsfield–Jackson Atlanta Airport (ATL)",
    "O'Hare Chicago Airport (ORD)",
    "Dallas/Fort Worth Airport (DFW)",
    "John F. Kennedy Airport (JFK)",
    "Denver Airport (Den)",
    "San Francisco Airport (SFO)",
    "McCarran Airport (LAS)",
    "Charlotte Douglas Airport (CLT)",
    "Seattle–Tacoma Airport (SEA)",
    "Phoenix Sky Harbor Airport (PHX)",
    "Miami Airport (MIA)",
    "Orlando Airport (MCO)",
    "George Bush Intercontinental Houston Airport (IAH)",
    "Newark Liberty Airport (EWR)",
    "Minneapolis–Saint Paul Airport (MSP)",
    "Logan Boston Airport (BOS)",
    "Detroit Metropolitan Airport (DTW)",
    "Philadelphia Airport (PHL)",
    "Salt Lake City Airport (SLC)",
    "Portland Airport (PDX)",
    "St. Louis Lambert Airport (STL)",
    "Austin-Bergstrom Airport (AUS)",
    "Nashville Airport (BNA)",
    "Oakland Airport (OAK)",
    "Louis Armstrong New Orleans Airport (MSY)",
    "Raleigh-Durham Airport (RDU)",
    "Ronald Reagan Washington National Airport (DCA)",
    "Chicago Midway Airport (MDW)",
    "San Jose Airport (SJC)",
    "Los Angeles Airport (LAX)",
    "Pittsburgh Airport (PIT)",
    "Raleigh Durham Airport (RDU)"
];