const express = require("express");
const path = require("path");
const fs = require('fs')
const mongoose = require('mongoose')
const MongoClient = require('mongodb').MongoClient;
const db = require("./database");

const movements = require('./routes/movement')

//const userRoute = require('./routes/userRoute')

const app = express();

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "client/build")));

app.set('views', __dirname + '/public/views')
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    res.render('index')
})

const port = process.env.PORT || 5000;
app.listen(port);



async function test(){

    let user = await db.getUser(mongoose.Types.ObjectId("5ffa380bc6c7e25d3d20af53"));
    console.log(user);
}
test();


console.log(`Password generator listening on ${port}`);