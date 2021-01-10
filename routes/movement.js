const express = require("express");
const router = express.Router()
const User = require('../models/user')
const Movement = require('../models/movement')
const Community = require('../models/community')
var MongoClient = require('mongodb').MongoClient
const mongoose = require('mongoose')
const fs = require('fs')
const db = require('../db')

const movement_vote_pts = 1
const num_top_amsdrs = 5
const num_top_mvments = 8
const mvmnt_donation_pts = 4
const cmnty_donation_pts = 10



router.post('/create', (req, res) => {

    var mv = Movement()


    mv.name = req.body.name
    mv.description = req.body.description
    mv.goal = req.body.goal

    mv.votes.push(req.user._id)

    db.add_movement(req.user._id, mv._id)

    mv.save()
        .then((result) => {
            console.log('sssss')
            res.render('index')
        })
        .catch((err) => {
            console.log(err)
        })
})


router.get('/create', (req, res) => {
    if (!req.user)
        res.redirect('/signin')

    res.render('createMovement')
})


module.exports = router