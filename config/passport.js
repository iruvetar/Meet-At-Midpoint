var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/userModel.js');



module.exports = function(passport) {
    //Serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });
    
    //Deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
    
    //Signup
    passport.use('local-signup', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    },
    function(req, email, password, done) {
        process.nextTick(function() {
            //find user who has same email
            User.findOne({'local.email' : email}, function(err, user) {
                if (err) {
                    return done(err);
                }
                if (user) {
                    return done(null, false, req.flash('signupMessage', 'That email is already registered.'));
                } else {
                    //if no user with the email
                    var newUser = new User();
                    
                    newUser.local.email = email;
                    newUser.local.password = newUser.generateHash(password);
                    
                    newUser.save(function(err) {
                        if (err)
                            throw err;
                        return done(null, newUser);
                    });
                }
            });
        });
    }));
    //Login
    passport.use('local-login', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    },
    function(req, email, password, done) {
        User.findOne({'local.email' : email}, function(err, user) {
            if (err)
                return done(err);
            if (!user)
                return done(null, false, req.flash('loginMessage', 'No user found.'));
            
            if (!user.validPassword(password))
                return done(null, false, req.flash('loginMessage', 'Wrong Password.'));
            
            //Everything is correct
            return done(null, user);
        });
    }));
};
