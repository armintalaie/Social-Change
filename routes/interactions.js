const movement_vote_pts = 1
const num_top_amsdrs = 5
const num_top_mvments = 8
const mvmnt_donation_pts = 4
const cmnty_donation_pts = 10

const User = require('../models/user')
const Movement = require('../models/movement')
const Community = require('../models/community')

const db = require("../database.js");

app.get('/vote/:movementid/:userid', async (req, res) => {
    let user_id = mongoose.Types.ObjectId(req.params.movementid);
    let movement_id = mongoose.Types.ObjectId(req.params.userid);

    await db.vote(movement_id,user_id);
    res.render('lp')
})



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