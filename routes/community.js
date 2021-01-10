const express = require('express')
const router = express.Router()
const User = require('../models/user')
const passport = require('passport')
const session = require('express-session');
const bcrypt = require('bcrypt');
const db = require("../database")


// restarts the community by removing the movements in it and distributing the money
router.get('/community/restart/:id', (req, res) => {

})


// find community by id and get all the movements + the votes it has
router.get('/community/donate/:id', (req, res) => {

})




// functions
// getCommunity(id) return one
// getCommunityMovements(id) return array
// restartCommunity(id) 
// updateCommunity