const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const communitySchema = new Schema({
    name: String,
    photo: String,
    description: String,

    movements: [
        {
            id: {
                type: mongoose.Types.ObjectId,
                ref: "movements",
            },
        },
    ],

    fund: Number,
    count: Number,

    donations: [
        {
            id: {
                type: mongoose.Types.ObjectId,
                ref: "donations",
            },
        },
    ],
});

const Community = mongoose.model("community", communitySchema);

module.exports = Community;
