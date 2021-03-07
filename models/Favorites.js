const mongoose = require('mongoose');
// Schema
const favoritesDataSchema = new mongoose.Schema({
    productId: {
        type: String,
        required: true
    },
    useremail: {
        type: String,
        required: true
    },
    product: {
        type: Object,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})
const favorites = mongoose.model('favorites', favoritesDataSchema)
module.exports = favorites