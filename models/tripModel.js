exports.collectionName = 'TripHistory';

exports.getMidPoint = function (l1, l2) {
    //simply calculate the mid point
    let midLat = (l1.lat + l2.lat) / 2;
    let midLong = (l1.long + l2.long) / 2;
    return {lat:midLat, long:midLong};
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
