var mongoModel = require("../models/mongoModel.js");
var trip = require('../models/tripModel.js');
var fs = require('fs');

exports.init = function(app, passport) {
    //Welcome and landing Page
    app.get('/', index);
    
    //Self introduction page
    app.get('/author', getAuthor);
    
    //Go to the Github page
    app.get('/resources', function(req, res) {
        res.redirect('https://github.com/iruvetar/Meet-At-Midpoint');
    }); 
    

    
    // ====================
    // Login===============
    // ====================
    //show the login form
    app.get('/login', function(req, res) {
        //render the page and pass in any flash data in exists
        res.locals.login = req.isAuthenticated();
        res.render('loginPage', {message: req.flash('loginMessage')})
    });
    
    //process login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/service',
        failureRedirect : '/login',
        failureFlash : true
    }));
    
    // ====================
    // Signup===============
    // ====================
    
    //show the signup form
    app.get('/signup', function(req, res) {
        res.locals.login = req.isAuthenticated();
        res.render('signupPage', {message: req.flash('signupMessage')})
    });
    
    //process signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/service',
        failureRedirect : '/signup',
        failureFlash : true
    }));
    
    // ====================
    // Only available if logged in
    // ====================
    //The service page
    app.get('/service', isLoggedIn, getService); 
    //The result page
    app.post("/trip", isLoggedIn, preTrip);
    
    // ====================
    // Logout===============
    // ====================
    app.get('/logout', function(req, res){
       req.logout();
       res.locals.login = false;
       res.redirect('/');
    });
    
    
}

// =====Functions===========

// Handle the trip route
var preTrip = function(req, res) {
    
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
            calculateTrip(req,res,air1[0],air2[0],req.body.dDate, depart1, iata1, depart2, iata2);
        })
    });
}

//Function that return airport object from mongoDB given iata code
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

//Function that creates the trip with two airport objects
var calculateTrip = function(req, res, air1, air2, dDate, depart1, iata1, depart2, iata2) {
    console.log("Create trip on server side.");
    //Object that holds the latitude and longtitude
    var middlePoint = trip.getMidPoint(air1, air2);
    var midAirports = trip.getMidAirports(middlePoint.lat, middlePoint.long, function(returnJson) {
        console.log("Controller receive json");
        checkAirport(returnJson, req, res, depart1, iata1, depart2, iata2);
    });
}

//Function that filter out unpopular airports by checking the data in the airport collection
var checkAirport = function(airportList, req, res, depart1, iata1, depart2, iata2) {
    console.log("check airports");
    var array = [];
    for (let i = 0; i < airportList.length; i++) {
        var iataKey = array.push(airportList[i].code);
    }
    console.log(array);
    //mongo db query format:
    //{
    //    "key": {
    //        "$in": [
    //            "PIT",
    //            "LAX"
    //        ]
    //    }
    //}
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
        trip.getAirfare(modelData, iata1, req.body.dDate, function(returnPrice1) {
            if (returnPrice1.length) {
                trip.getAirfare(modelData, iata2, req.body.dDate, function(returnPrice2) {
                    res.locals.login = req.isAuthenticated();
                    if (returnPrice2.length) {
                        //Complete Data
                        res.render('resultPage', {obj : modelData, depart1 : depart1, depart2 : depart2, fare1: returnPrice1, fare2: returnPrice2, errMsg: null, place1: req.body.depart1, place2: req.body.depart2, date: req.body.dDate, destination: modelData});
                    } else {
                        //First fare received but second one failed
                        var message = "Recommended Destination found but no corresponding airfare information found. We are sorry for the inconvenience.";
                        res.render('resultPage', {depart1 : depart1, depart2: depart2, errMsg: message});
                    }
                })
            } else {
                res.locals.login = req.isAuthenticated();
                //Destination received but no airfare information for this destination
                var message = "Recommended Destination found but no corresponding airfare information found. We are sorry for the inconvenience.";
                res.render('resultPage', {depart1 : depart1, depart2: depart2, errMsg: message});
            }
        })
        
    } else {
        res.locals.login = req.isAuthenticated();
        console.log("No airport info back");
        var message = "No appropriate airports could be found. We are sorry for the inconvenience.";
        res.render('resultPage', {depart1 : depart1, depart2: depart2, errMsg: message});
    }
    });
}




// Render the homepage of the web application to the user
var index = function(req, res) {
    res.locals.login = req.isAuthenticated();
    res.render('welcomePage');
}

// Render the service page of the web application to the user
var getService = function(req, res) {
    res.locals.login = req.isAuthenticated();
    res.render('servicePage');
}

// Render the author page of the web application to the user
var getAuthor = function(req, res) {
    res.locals.login = req.isAuthenticated();
    res.render('message', {title: 'Author Info', obj: "Author is Yun-Tieh Chen"});
}

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated()) {
        res.locals.login = true;
        return next();
    }
    
    // if they aren't redirect them to the home page
    res.redirect('/login');
}