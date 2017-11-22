//var mongoModel = require("../models/mongoModel.js");
var trip = require('../models/tripModel.js');
var fs = require('fs');

exports.init = function(app) {
    //Full Page
    app.get('/', index);
    app.get('/service', getService); //Go to service page
    app.get('/author', getAuthor); //Go to self introduction page
    app.get('/resources'); //Go to resource page, plan to put the information about the APIs used and the template used. Like a readme.md file
    app.get('/trip', gettripOne) //Display the calculation result
    
    //For CRUD methods
    app.get("/trip/:name", gettripOne);
    app.put("/trip/:name/:depart/:to/:fromDate/:toDate", createTrip);
    app.post("/trip", updateTrip);
    app.delete("/trip/:name", deleteTrip); 
}

var gettripOne = function(req, res) {
    var query = trip.getTrip(req.params.name);
    mongoModel.retrieve(trip.collectionName,
                        query,
                        function(modelData) {
        if (modelData.length) {
            res.render('result',{title: 'Retrieve Demo', obj: modelData});
        } else {
            var message = "No documents with " + JSON.stringify(req.query) + " in collection" + req.params.collection + " found.";
            res.render('message', {title: 'Retrieve Demo', obj: message});
        }
    });
}

//exports.delete = function(collection, filter, option, callback) {

var deleteTrip = function(req, res) {
    
//    var filter = req.body.find? JSON.parse(req.body.find) : {};
    var tripObj = trip.deleteTrip(req.params.name);
    mongoModel.delete(trip.collectionName, tripObj, null, function(status) {
        res.render('message', {title: 'Delete Done', obj: status});
    });
}
var updateTrip = function(req, res) {

    var filter = req.body.find? JSON.parse(req.body.find) : {};
    if (!req.body.update) {
        res.render('message', {title: 'Update', obj: "No update operation defined"});
    }

    var update = JSON.parse(req.body.update);
    console.log(update);
    mongoModel.update(trip.collectionName, filter, update, function(status) {
        res.render('message', {title: 'Update Done', obj: status});
    });
}
// Handle the put route
var createTrip = function(req, res) {
    console.log(req);
//    if (Object.keys(req.body).length == 0) {
//        console.log('No req body');
//        res.render('message',{title:'Create Error', obj:"No create message body found"});
//        return;
//    }
    
    console.log("Create trip on server side.");
    //Get a trip object
    var tripObj = trip.addTrip(req.params.name,req.params.depart,req.params.to,req.params.fromDate, req.params.toDate);
    //Call the model create method
    mongoModel.create(trip.collectionName,
                     tripObj, function(result) {
        var success = (result ? "Create Successful" : "Create Failed");
        console.log("Callback receive: " + success);
        res.render('message', {title: 'Create Obj', obj: success});
    });
}

// Render the homepage of the web application to the user
var index = function(req, res) {
    res.render('welcomePage');
};

var getService = function(req, res) {
    res.render('servicePage');
};

var getAuthor = function(req, res) {
    res.render('message', {title: 'Author Info', obj: "Author is Yun-Tieh Chen"});
}