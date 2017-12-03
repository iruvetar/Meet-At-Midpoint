
var morgan = require('morgan');
var fs = require('fs');
var bodyParser = require('body-parser');
var path = require('path');
var mongoose = require('mongoose');
var passport = require('passport');
var session = require('express-session');
var flash = require('connect-flash');

var express = require('express');
var app = express();

// Configuration ======
var connection_string = 'mongodb://meetatmidpointUser:meetatmidpointiscool@ds113566.mlab.com:13566/meetatmidpoint';

mongoose.connect(connection_string);

require('./config/passport')(passport); //pass passport for configuration

//Set the views directory
app.set('views', __dirname + '/views');

//Define view engine
app.set('view engine', 'ejs');

/*
 * It will log all requests in the Apache combined format to STDOUT
 */
app.use(morgan('common'));



// Parse application/x-www-form-urlencoded, with extended qs library
app.use(bodyParser.urlencoded({extended: true}));

// required for passport
app.use(session({ secret: 'sessionsecret' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


// Load all routes in the routes directory
fs.readdirSync('./routes').forEach(function(file) {
    if (path.extname(file) == '.js') {
        console.log("Adding routes in " + file);
        require('./routes/' + file).init(app, passport);
    }
});

//require('./routes/trip.js').init(app);


/*
 * Static middleware
 */

app.use(express.static(__dirname + '/public'));

//Catch routes not handed with an error message
app.use(function(req, res) {
    var message = 'Error, did not understand path '+req.path;
    //Set the status to 404 not found and render a messsage
    res.status(404).render('error',{'message': message});
});

var httpServer = require('http').createServer(app);

httpServer.listen(50000, function() {
    console.log("Server listening on port:" + this.address().port);
});
