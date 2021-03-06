const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = require('../models/user')
const Community = require('../models/community')
const Photo = require('../models/photo')
const passport = require('passport')
const session = require('express-session');
const bcrypt = require('bcrypt');
const db = require("../database")
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

// restarts the community by removing the movements in it and distributing the money
router.get('/community/restart/:id', async(req, res) => {
    await db.passMovements(mongoose.Types.ObjectId(req.params.id));
})

// find community by id and get all the movements + the votes it has
router.get('/community/:id', async(req, res) => {
    let comm = await db.getCommunity(mongoose.Types.ObjectId(req.params.id));
    res.locals.movements = await db.getMovements(comm._id);
    for (move of res.locals.movements){
        await db.calculateVotes(move._id);
    }
    res.locals.community = comm;
    res.locals.donations = await db.getDonations(comm._id);
    res.locals.user = req.user;
    res.render('community');
})

async function createC(client, req) {
    var photo = new Photo();
    photo.img = {
        data: fs.readFileSync(path.join(__dirname + '/../uploads/photos/' + req.file.filename)),
        contentType: 'image/png'
    }

    let db = client.db("nwHacks")

    var community = new Community()
    community.name = req.name
    community.photo = photo._id
    db.collection('photos').insertOne(photo)
    db.collection('communities').insertOne(community);
}

router.post('/upload', upload.single('image'), async(req, res) => {
    let photo = new Photo();
    photo.img = {
        data: fs.readFileSync(path.join(__dirname + '/../uploads/photos/' + req.file.filename)),
        contentType: 'image/png'
    }
    await createPhoto(photo);
    res.render('lp');

})

router.get('/donate/:commid/:userid/:amount', async(req, res) => {
    let user_id = mongoose.Types.ObjectId(req.params.userid);
    let comm_id = mongoose.Types.ObjectId(req.params.commid);
    let amount = Number(req.params.amount);
    await db.createDonation(user_id, comm_id, amount);
    //res.render('lp')
})


router.post('/donate/:commid', async(req, res) => {
    let user_id = req.user._id
    let comm_id = mongoose.Types.ObjectId(req.params.commid);
    let amount = req.body.amount
    await db.createDonation(user_id, comm_id, amount);
    res.redirect('../home')
})

module.exports = router