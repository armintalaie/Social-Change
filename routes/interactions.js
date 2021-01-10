const User = require('../models/user')
const Movement = require('../models/movement')
const Community = require('../models/community')

const db = require("../database.js");

app.get('/vote/:movementid/:userid', async (req, res) => {
    let user_id = mongoose.Types.ObjectId(req.params.userid);
    let movement_id = mongoose.Types.ObjectId(req.params.movementid);

    await db.vote(movement_id,user_id);
    res.render('lp')
})

app.get('/trust/:truster/:trustee', async (req, res) => {
    let truster = mongoose.Types.ObjectId(req.params.truster);
    let trustee = mongoose.Types.ObjectId(req.params.trustee);
    await db.trust(truster_id,trustee_id);
    res.render('lp')
})

app.get('/donate/:commid/:userid/:amount', async (req, res) => {
    let user_id = mongoose.Types.ObjectId(req.params.userid);
    let comm_id = mongoose.Types.ObjectId(req.params.commid);
    let amount = Number(req.params.amount);
    await db.createDonation(user_id,comm_id,amount);
    res.render('lp')
})

module.exports = router