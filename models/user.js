const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: String,
    password: String,
    trusts: String,
    trusted_by: [{
        id: String
    }],

    photo: String,
    bio: String,
    points: Number,
});

module.exports = userSchema;