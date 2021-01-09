const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const communitySchema = new Schema({
    community: String,
    photo: String,
    description: String,

    movements: [
        {
            id: {
                type: mongoose.Types.ObjectId,
                ref: "users"
            }
        }
    ],


});

const Community = mongoose.model('community', communitySchema)

module.exports = Community;