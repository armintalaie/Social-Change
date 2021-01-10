const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const communitySchema = new Schema({
    name: String,
    photo: {
        type: mongoose.Types.ObjectId,
        ref: "photos",
    },
    description: String,

    movements: [
        {
            id: {
                type: mongoose.Types.ObjectId,
                ref: "movements",
            },
        },
    ],

    donations: [
        {
            id: {
                type: mongoose.Types.ObjectId,
                ref: "donations"
            }
        }
    ],

    balance: Number,

    votes: Number,
    lifetime_votes: Number

});

const Community = mongoose.model("community", communitySchema);

module.exports = Community;
