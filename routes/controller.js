var mongoModel = require("../models/mongoModel.js");
var trip = require('../models/tripModel.js');
var fs = require('fs');

exports.init = function(app) {
    //Full Page
    app.get('/', index);
    app.get('/service', getService); //Go to service page
    app.get('/author', getAuthor); //Go to self introduction page
    app.get('/resources'); //Go to resource page, plan to put the information about the APIs used and the template used. Like a readme.md file
    
    //process login form
    //app.post('/login',dosomething);
    
    //show the login form
    app.get('/login', function(req, res) {
        res.render('loginPage', {message: req.flash('loginMessage')})
    });
    
    //process signup form
    //app.post('/signup', dosomething);
    
    //show the signup form
    app.get('/signup', function(req, res) {
        res.render('signupPage', {message: req.flash('loginMessage')})
    });
    
    
    app.get('/trip', gettripOne) //Display the calculation result
    
    //For CRUD methods
    app.get("/trip/:name", gettripOne);
//    app.put("/trip/:name/:depart/:to/:fromDate/:toDate", createTrip);
    app.post("/trip", preTrip);
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

// Handle the trip route
var preTrip = function(req, res) {
    console.log(req.body);
    if (Object.keys(req.body).length == 0) {
        console.log('No req body');
        res.render('message',{title:'Create Error', obj:"No create message body found"});
        return;
    }
    
    console.log("Prepareing to create trip...");
    
    //process param body
    var depart1 = req.body.depart1;
    var iata1 = depart1.substring(depart1.indexOf("(") + 1, depart1.indexOf("(") + 4);
    depart1 = depart1.substring(0, depart1.indexOf("("));
    
    var depart2 = req.body.depart2;
    var iata2 = depart2.substring(depart2.indexOf("(") + 1, depart2.indexOf("(") + 4);
    depart2 = depart2.substring(0, depart2.indexOf("("));
    
    var air1 = null, air2 = null;
    getAirport(iata1, function(returnData) {
        air1 = returnData;
        getAirport(iata2, function(returnData2) {
            air2 = returnData2;
            calculateTrip(req,res,air1[0],air2[0],req.body.dDate, depart1, depart2);
        })
    });
//Function that creates the trip search history
var calculateTrip = function(req, res, air1, air2, dDate, depart1, depart2) {
    console.log("Create trip on server side.");
    //Object that holds the latitude and longtitude
    var middlePoint = trip.getMidPoint(air1, air2);
    var midAirports = trip.getMidAirports(middlePoint.lat, middlePoint.long, function(returnJson) {
        console.log("Controller receive json");
        checkAirport(returnJson, req, res, depart1, depart2);
    });
}

//mongo db query format:
//{
//    "key": {
//        "$in": [
//            "PIT",
//            "LAX"
//        ]
//    }
//}
var checkAirport = function(airportList, req, res, depart1, depart2) {
    console.log("check airports");
    var array = [];
    for (let i = 0; i < airportList.length; i++) {
        let iataKey = array.push(airportList[i].code);
    }
    console.log(array);
    var subquery = {
        "$in" : array
    };
    var query = {
        key : subquery
    };
    
        mongoModel.retrieve("Airports",
                        query,
                        function(modelData) {
        if (modelData.length) {
            console.log("Recommended Destination: ");
            console.log(modelData);
            //modelData is an array
            res.render('resultPage', {obj : modelData, depart1 : depart1, depart2 : depart2});
        } else {
            console.log("NO airport info back");
            var message = "No documents with the iata code: " + iata + " in collection Airports.";
            res.render('message', {title: 'Retrieve Demo', obj: message});
        }
    });
}
var createTrip = function() {
    
}
//    //Get a trip object
//    var tripObj = trip.addTrip(req.params.name,req.params.depart,req.params.to,req.params.fromDate, req.params.toDate);
//    //Call the model create method
//    mongoModel.create(trip.collectionName,
//                     tripObj, function(result) {
//        var success = (result ? "Create Successful" : "Create Failed");
//        console.log("Callback receive: " + success);
//        res.render('message', {title: 'Create Obj', obj: success});
//    });
}

var getAirport = function(iata, callback) {

    var queryObj = {key : iata};
    
    mongoModel.retrieve("Airports",
                        queryObj,
                        function(modelData) {
        if (modelData.length) {
            callback(modelData);
        } else {
            console.log("NO airport info back");
            var message = "No documents with the iata code: " + iata + " in collection Airports.";
            res.render('message', {title: 'Retrieve Demo', obj: message});
        }
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

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}