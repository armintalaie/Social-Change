const express = require("express");
const router = express.Router();
const Movement = require("../models/movement");
require("../db.js");
const db = require("../database.js");
const mongoose = require("mongoose");

router.post("/create", async (req, res) => {
    let mv = Movement();

    mv.name = req.body.name;
    mv.description = req.body.description;
    mv.goal = req.body.goal;
    mv.count = 0;
    mv.passed = false;
    mv.created_by = req.user._id;

    let community = req.body.community;
    console.log(req.body.goal);
    console.log(community);
    console.log(typeof community);
    mv.community = mongoose.Types.ObjectId(community);

    // mv.communities = community._id;

    await db.createMovement(req.user._id, mv);

    res.render("index");
});

router.get("/create", async (req, res) => {
    if (!req.user) res.redirect("/signin");

    res.locals.communities = await db.getAllCommunities();
    console.log(res.locals.communities);
    res.render("createMovement");
});

module.exports = router;
