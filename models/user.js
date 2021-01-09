var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var userSchema = new Schema({
    id: String,
    trusts: String,
    trusted_by: [
        {
            id: String
        }
    ],

    photo: String,
    bio: String,
    points: Number,
});

module.exports = userSchema;