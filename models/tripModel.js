//request is a module that makes http calls.
var request = require('request');

exports.collectionName = 'TripHistory';

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
    //The unit of the distance queyr parameter is kilometres 
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



exports.getTrip = function(name) {
    let t = {};
    t["name"] = name;
    return t;
}
exports.addTrip = function(name, departure, destination, date1, date2) {
    let newTrip = {};
    newTrip["name"] = name;
    newTrip["dep"] = departure;
    newTrip["des"] = destination;
    newTrip["dDate"] = date1;
    newTrip["rDate"] = date2;
    return newTrip;
}


exports.deleteTrip = function(target) {
    let trip = {};
    trip["name"] = target;
    return trip;
}
