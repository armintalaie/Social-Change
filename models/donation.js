const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const donationSchema = new Schema({

    community : mongoose.Types.ObjectId,
    user : mongoose.Types.ObjectId,
    amount : Number

});

const Donation = mongoose.model('donation', donationSchema)

module.exports = Donation;