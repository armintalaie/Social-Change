const express = require("express");
const path = require("path");
const fs = require('fs')
const mongoose = require('mongoose')
const MongoClient = require('mongodb').MongoClient;

const db = require("./database");
var bodyParser = require('body-parser')
const session = require('express-session')

const movements = require('./routes/movement')
const passport = require('passport')
require("./passport")(passport)
const userRoute = require('./routes/userRoute')

const app = express();

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "client/build")));

app.set('views', __dirname + '/public/views')
app.set('view engine', 'ejs')


app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }))



app.get('/', (req, res) => {


    res.redirect('/home')



})

app.get('/home', (req, res) => {

    res.render('lp')


})



app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}))

app.use(passport.initialize())
app.use(passport.session())



app.use(movements)
app.use(userRoute)

const port = process.env.PORT || 5000;
app.listen(port);



async function test(){

    let user = await db.getUser(mongoose.Types.ObjectId("5ffa380bc6c7e25d3d20af53"));
    console.log(user);
}
test();


console.log(`Password generator listening on ${port}`);