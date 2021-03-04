const mongoose = require('mongoose');
// Schema
const vapesDataSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    company: {
        type: String,
        required: true
    },
    thc: {
        type: String,
        required: true
    },
    cbd: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    subcategory: {
        type: String,
        required: true
    },
    photoDownloadUrl1: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    size: {
        type: Array,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})
const vapes = mongoose.model('vapes', vapesDataSchema)
module.exports = vapes