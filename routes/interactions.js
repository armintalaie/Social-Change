const movement_vote_pts = 1
const num_top_amsdrs = 5
const num_top_mvments = 8
const mvmnt_donation_pts = 4
const cmnty_donation_pts = 10

const User = require('../models/user')
const Movement = require('../models/movement')
const Community = require('../models/community')
var MongoClient = require('mongodb').MongoClient

const mongoose = require('mongoose');

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
var db


const mongoose = require('mongoose')

// connect to mongodb
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => console.log("connected to db"))
    .catch((err) => console.log(err))


MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, function(err, db) {
    if (err) {
        console.log('failed to connect ' + err)
    } else {
        mydb = db.db('Shelf')
    }
})



async function vote(client, movement_id, user_id) {
    let db = client.db(dbName)
    var user_col = db.col('users')
    var move_col = db.col('movements')

    var user = await user_col.findOne({ "_id": user_id })
    var movement = await move_col.findOne({ "_id": movement_id })

    addPoint(user, movement_vote_pts)
    user.movements.push(movement._id)
    movements.votes.push(user._id)

}

function addPoint(user, pts) {
    user.points += pts
}


// top people
function topAmbassadors() {

    let db = client.db(dbName)
    var user_col = db.col('users')
    var top = new Array(num_top_amsdrs)
    user_col.find().sort({ votes: -1 })
        .limit(num_top_amsdrs),
        function(err, results) {
            top = results
        }.lean()

    return top

}


// top people
function topMovements() {

    let db = client.db(dbName)
    var movement_col = db.col('movements')
    var top = new Array(num_top_mvments)
    movement_col.find().sort({ votes: -1 })
        .limit(num_top_mvments),
        function(err, results) {
            top = results
        }.lean()

    return top

}

//donation
function donate(user, amount, movement) {
    //TODO: payment
    if (is_community) {
        addPoint(user, mvmnt_donation_pts)
    } else {
        addPoint(user, cmnty_donation_pts)
    }
}



// TODO
function distributeDonations(community) {}



// TODO
function removeMovement(movement) {

}



function community_movements(community) {

    var mv = new Movement;
    Movement.find({ community_id: community._id }).sort({ votes: -1 }).then(results => {}).lean()


}

module.exports = router