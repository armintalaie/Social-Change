const express = require("express");
const router = express.Router()
const Movement = require('../models/movement')
require('../db.js')
const db = require('../database.js')

router.post('/create', async (req, res) => {

    let mv = Movement()

    mv.name = req.body.name
    mv.description = req.body.description
    mv.goal = req.body.goal
    mv.count = 0;
    mv.passed = false;
    mv.created_by = req.user._id;

    await db.createMovement(req.user._id, mv)
    
    res.redirect('/')
})


router.get('/create', (req, res) => {
    if (!req.user)
        res.redirect('/signin')

    res.render('createMovement')
})


module.exports = router