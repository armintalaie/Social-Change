const express = require('express')
const router = express.Router()
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
router.get('/community/restart/:id', (req, res) => {

})


// find community by id and get all the movements + the votes it has
router.get('/community/create', (req, res) => {
    res.render('community')
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
    if (!req.file) {
        console.log("No file received");
    }
    const uri = 'mongodb+srv://Kevin:zuNfarbTfeeRDYz8@cluster0.rbltt.mongodb.net/nwHacks?retryWrites=true&w=majority'
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    try {
        await client.connect();
        var photo = new Photo();
        photo.img = {
            data: fs.readFileSync(path.join(__dirname + '/../uploads/photos/' + req.file.filename)),
            contentType: 'image/png'
        }
        let db = client.db("nwHacks")
        await db.collection('photos').insertOne(photo)
        res.render('lp')
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
})




// functions
// getCommunity(id) return one
// getCommunityMovements(id) return array
// restartCommunity(id) 
// updateCommunity


module.exports = router