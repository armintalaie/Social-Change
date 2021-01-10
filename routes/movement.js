const express = require("express");
const router = express.Router()
const User = require('../models/user')
const Movement = require('../models/movement')
const Community = require('../models/community')
var MongoClient = require('mongodb').MongoClient
const mongoose = require('mongoose')

const movement_vote_pts = 1
const num_top_amsdrs = 5
const num_top_mvments = 8
const mvmnt_donation_pts = 4
const cmnty_donation_pts = 10



const uri = "mongodb+srv://Kevin:zuNfarbTfeeRDYz8@cluster0.rbltt.mongodb.net/nwHacks?retryWrites=true&w=majority"
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true })




// connect to mongodb
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => console.log("connected to db"))
    .catch((err) => console.log(err))



function create_movement() {

    var mv = new Movement;
    mv.save()
        .then((res) => {

        })
        .catch((err) => {
            console.log(err)
        })

    Movement.find({}, function(err, results) {
        console.log('aaa')
    }).lean()


}


router.get('/cr', (req, res) => {
    create_movement()
})

module.exports = router