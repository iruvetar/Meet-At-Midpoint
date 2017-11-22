//var trip = require('../models/trip.js');
//var fs = require('fs');
///*
// * Export an init method that will define a set of routes
// * handled by this file.
// * @param app - The Express app
// */
exports.init = function(app) {
  app.get("/trip", gettripAll);
  app.get("/trip/:name", gettripOne);
  app.put("/trip/:name/:depart/:to/:fromDate/:toDate", puttrip);
  app.post("/trip/:name/:depart/:to/:fromDate/:toDate", posttrip);
  app.delete("/trip/:name", deletetrip);
  }
//var getpage = function(request, response) {
//
//    // A ReadStream will emit events when data is available, when done, or error
//    let rs = fs.createReadStream('../public/html/form.html');
//    rs.setEncoding('utf8'); 
//    // set how the printable characters are represented
//    
//    rs.on('error', function(e) {
//              // Give the 404 response status, and set the content type
//              response.writeHead(404, {'Content-Type': 'text/plain'});
//              response.end('NOT FOUND') // Use a dynamic port to have this process listen to
//    });
//    
//    // Define a callback for when a chunk of data is available from the file
//        rs.on('data', function(data) {
//
//        // Give the OK response status, and set the content type
//        response.writeHead(200, {'Content-Type': 'text/html'});
//        response.end(data);
//        
//        });
//};
// Handle the post route
var posttrip = function(request, response) {
    console.log("post(update) trip");
    var tripObj = trip.updateTrip(request.params.name,request.params.depart,request.params.to,request.params.fromDate, request.params.toDate);
    response.send(tripObj);
}

// Handle the delete route
var deletetrip = function(request, response) {
    console.log("delete trip");
    var res = trip.deleteTrip(request.params.name);
    response.send(res);
}
// Handle the get route when no name is provided
var gettripAll = function(request, response) {
    
}
// Handle the get route when the specific name is provided
var gettripOne = function(request, response) {
    console.log("get trip");
    var tripObj = trip.getTrip(request.params.name);
    response.send(tripObj);
}
// Handle the put route
var puttrip = function(request, response) {
    console.log("put(add) trip");
    var tripObj = trip.addTrip(request.params.name,request.params.depart,request.params.to,request.params.fromDate, request.params.toDate);
    response.send(tripObj);
}

//
//getUser = function(request, response) {
//  response.end("The user is "+userStored.username+" and the " +userStored.userinfo + " is " + userStored.uservalue) ;
//  }
//
//// Handle put user request
//putUser = function(request, response) {
//    //store information about the user in an object
//    userStored.username = request.params.username;
//    userStored.userinfo = request.params.userinfo;
//    userStored.uservalue = request.params.uservalue;
//    //response
//    response.end("Adding the user "+request.params.username+" and info "+request.params.userinfo+" with value "+request.params.uservalue);
//  }