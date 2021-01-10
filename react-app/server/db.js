const mongoose = require('mongoose')
const path = require("path");
const fs = require('fs')
const MongoClient = require('mongodb').MongoClient;
var db

try {
    db = fs.readFileSync('uri.txt', 'utf8');
    console.log(db);

    mongoose.connect(db, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true
    });

    MongoClient.connect(db, { useNewUrlParser: true, useUnifiedTopology: true }, function(err, datab) {
        if (err) {

            console.log('failed to connect ' + err)
        } else {
            db = datab.db('nwhacks')
        }
    })
} catch (e) {
    console.log('Error:', e.stack);
}



module.exports = db