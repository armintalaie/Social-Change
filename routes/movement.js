const express = require("express");
const router = express.Router();
const Movement = require("../models/movement");
require("../db.js");
const db = require("../database.js");
const mongoose = require("mongoose");


const User = require('../models/user')
const Community = require('../models/community')
const Photo = require('../models/photo')

var bodyParser = require('body-parser')
var multer = require('multer')
var path = require('path')
var fs = require('fs')
const MongoClient = require('mongodb').MongoClient;



storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, __dirname + '/../uploads/photos')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})
var upload = multer({ storage: storage })




router.post("/create", upload.single('image'), async(req, res) => {
    let mv = Movement();

    mv.name = req.body.name;
    mv.description = req.body.description;
    mv.goal = req.body.goal;
    mv.count = 0;
    mv.passed = false;
    mv.created_by = req.user._id;
    mv.votes = [];
    mv.donations = [];
    let community = req.body.community;

    var photo = new Photo();
    mv.image = await {
        data: fs.readFileSync(path.join(__dirname + '/../uploads/photos/' + req.file.filename)),
        contentType: 'image/png'
    }

    mv.community = mongoose.Types.ObjectId(community);

    //console.log(mv)
    await db.createMovement(req.user._id, mv.community, mv)

    res.redirect('/')
});

router.get("/create", async(req, res) => {
    if (!req.user) res.redirect("/signin");

    res.locals.communities = await db.getAllCommunities();
    //console.log(res.locals.communities);
    res.render("createMovement");
});

router.get('/vote/:movementid/:userid', async(req, res) => {
    let user_id = mongoose.Types.ObjectId(req.params.userid);
    let movement_id = mongoose.Types.ObjectId(req.params.movementid);

    await db.voteFunk(movement_id, user_id);
    await db.calculateVotes(movement_id);
})

module.exports = router;