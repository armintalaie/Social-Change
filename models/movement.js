const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const movementSchema = new Schema({
    community: String,
    photo: String,
    description: String,

    votes: [
        {
            id: {
                type: mongoose.Types.ObjectId,
                ref: "users"
            }
        }
    ],

    goal: Number,
    
    donations: [
        {
            id: {
                type: mongoose.Types.ObjectId,
                ref: "donations"
            }
        }
    ]
});

const Movement = mongoose.model('movement', movementSchema)

module.exports = Movement;