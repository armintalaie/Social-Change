const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const movementSchema = new Schema({
    name: String,
    community: {
        type: mongoose.Types.ObjectId,
        ref: "communites"
    },
    photo: {
        type: mongoose.Types.ObjectId,
        ref: "photos",
    },
    description: String,

    votes: [{
        id: {
            type: mongoose.Types.ObjectId,
            ref: "users"
        }
    }],

    goal: Number,

    donations: [{
        id: {
            type: mongoose.Types.ObjectId,
            ref: "donations"
        }
    }],

    created_by : mongoose.Types.ObjectId,
    count: Number,

    passed : Boolean
});

const Movement = mongoose.model('movement', movementSchema)

module.exports = Movement;