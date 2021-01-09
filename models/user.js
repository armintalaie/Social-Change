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
})

const User = mongoose.model('user', userSchema)

module.exports = User