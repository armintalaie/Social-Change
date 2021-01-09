const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const movementSchema = new Schema({
    community: String,
    photo: String,
    description: String,

    votes: [
        {
            id: String
        }
    ],

    goal: Number,
    
    donations: [
        {
            id: String
        }
    ]
});

const Movement = mongoose.model('movement', movementSchema)

module.exports = Movement;