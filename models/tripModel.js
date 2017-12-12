//request is a module that makes http calls.
var request = require('request');

//In the future, I plan to put the search history in this collection
//exports.collectionName = 'TripHistory';


//This function calculates the midpoint given to location object
exports.getMidPoint = function (l1, l2) {
    //simply calculate the mid point
    let midLat = (l1.lat + l2.lat) / 2;
    let midLong = (l1.long + l2.long) / 2;
    return {lat:midLat, long:midLong};
}

//This function handles request to http://iatacodes.org/
//This API provides information about airports given latitude, longtitude and distance
//Will return an array containing all the suggested airports near the midpoint
exports.getMidAirports = function(midLat, midLong, callback) {
    console.log("Making ajax request.....");
    //ajaxCallJsonp("https://iatacodes.org/api/v6/nearby.jsonp?&callback=?&api_key=f7d540ed-9d7c-4419-8f88-35d8bddbfc5d", place1, place2);
//    var data = $.getJSON(target,
//    {
//        lat: midLat,
//        lng: midLong,
//        distance: "500"
//    }, JsonCallback);
    var options = {
        url: 'https://iatacodes.org/api/v6/nearby?api_key=f7d540ed-9d7c-4419-8f88-35d8bddbfc5d',
        strictSSL: false,
//    secureProtocol: 'TLSv1_method',
        qs: {lat: midLat,lng: midLong, distance: "500"},
        json:true
    };
    //The unit of the distance query parameter is kilometres 
    request.get(options, function(err, res) {
        if (err) {
            console.log(err);
            return;
        } else {
            console.log("Ajax done: ");
            console.log(res.body.response);
            callback(res.body.response);
        }
    });
}

//This function handles request to Google QPX API
//This API provides information about real-time airfare and flight information
//Will return an array containing all the suggested airports near the midpoint
exports.getAirfare = function(airportArray, placeCode, date, callback) {
    //Object return from mongoDB
    var destinationCode = airportArray[0].key;
    
    var bodyObj = {
      "request": {
        "slice": [
          {
            "origin": placeCode,
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
    
    console.log("Making ajax request for airfare.....");
/*
var xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://www.googleapis.com/qpxExpress/v1/trips/search?key=AIzaSyD3eFiCwJPtgcaTbOE2Y4PWkL2FQqzWnQg',true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    

    
    xhr.send(JSON.stringify(body));
    xhr.onload = function() {
    // process the response.
     airfareResponse1(xhr.responseText);
    };
    xhr.onerror = function() {
      console.log('There was an error');
    };
*/
    var options = {
        method: 'POST',
        url: 'https://www.googleapis.com/qpxExpress/v1/trips/search?key=AIzaSyD3eFiCwJPtgcaTbOE2Y4PWkL2FQqzWnQg',
        strictSSL: false,
        body: bodyObj,
        json:true
    };
    
    request.post(options, function(err, res) {
        if (err) {
            console.log(err);
            return;
        } else {
            console.log("Airfare 1 Ajax done: ");
            console.log(res.body.trips.tripOption[0].saleTotal);
            //return price
            callback(res.body.trips.tripOption[0].saleTotal);
        }
    });
}

