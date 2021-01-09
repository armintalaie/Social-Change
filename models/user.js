const mongoose = require("mongoose")
const Schema = mongoose.Schema

const userSchema = new Schema({
    name: String,
    email: String,
    password: String,
    trusts: String,
    trusted_by: [{
        id: String
    }],

    photo: String,
    bio: String,
    points: Number,
})

const User = mongoose.model('product', userSchema)

module.exports = User