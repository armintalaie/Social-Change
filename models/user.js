const mongoose = require("mongoose")
const Schema = mongoose.Schema

const userSchema = new Schema({
    name: String,
    email: String,
    password: String,
    trusts: String,
    trusted_by: [{
        id: {
            type: mongoose.Types.ObjectId,
            ref: "users"
        }
    }],

    photo: String,
    bio: String,
    points: Number,

    donations: [{
        id: {
            type: mongoose.Types.ObjectId,
            ref: "donations"
        }
    }],
    votes: [{
        id: {
            type: mongoose.Types.ObjectId,
            ref: "movements"
        }
    }],
    movements: [{
        id: {
            type: mongoose.Types.ObjectId,
            ref: "movements"
        }
    }],
    balance: Number

})

const User = mongoose.model('user', userSchema)

module.exports = User