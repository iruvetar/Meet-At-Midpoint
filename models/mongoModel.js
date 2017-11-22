//Use Node.js MongoDB Driver
var mongoClient = require('mongodb').MongoClient;

/*
 *This is for mongodb running
 *Change the last part to reflect the name of your database
 */
var connection_string = 'mongodb://meetatmidpointUser:meetatmidpointiscool@ds113566.mlab.com:13566/meetatmidpoint'

//Global variable of the connected database
var mongoDB;

//Connect to MongoDB server
mongoClient.connect(connection_string, function(err, db) {
   if (err) doError(err);
    console.log("Connected to MongoDB server at:" + connection_string);
    mongoDB=db; //make reference to db globally available;
});

/********CRUD:Create*************/

exports.create = function(collection, data, callback) {
    console.log("Insert function in mongoModel");
    mongoDB.collection(collection).insertOne(
    data, //The object to be inserted
    function(err, status) { //callback upon completion
        if (err) doError(err);
        console.log("Insertion Done");
        var success = (status.result.n == 1? true : false);
        callback(success);
    });
}
/********CRUD:Retrieve*************/
exports.retrieve = function(collection, query, callback) {
  mongoDB.collection(collection).find(query).toArray(function(err, docs) {
    if (err) doError(err);
      //docs are mongoDB documents, return as an array of JS objects.
      callback(docs);});
}

/********CRUD:Update*************/
exports.update = function(collection, filter, update, callback) {
  mongoDB.collection(collection).updateMany(filter, update, {upsert:true}, function(err, status) {
     if (err) doError(err);
      callback('Modified ' + status.modifiedCount + 
              ' and added '+ status.upsertedCount + " documents");
  });
}

/********CRUD:Delete*************/
exports.delete = function(collection, filter, option, callback) {
  mongoDB.collection(collection).deleteMany(filter, option, function(err, status) {
     if (err) doError(err);
      callback('Deleted multiple documents');
  });
}

var doError = function(e) {
    console.error("ERROR: " + e);
    throw new Error(e);
}