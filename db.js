const mongoose = require('mongoose')
var db

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => console.log("connected to db"))
    .catch((err) => console.log(err))


// fetch the database
MongoClient.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true }, function(err, database) {
    if (err) {
        console.log('failed to connect ' + err)
    } else {
        db = database.db('Shelf')
    }
})


module.exports = db