const mongoose = require('mongoose')
const Schema = mongoose.Schema


const PhotoSchema = new Schema({
    image: { data: Buffer, contentType: String },

    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },

    public: {
        type: Boolean
    }

})


const Photo = mongoose.model('product', PhotoSchema)

module.exports = Product