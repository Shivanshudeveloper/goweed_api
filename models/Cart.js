const mongoose = require('mongoose');
// Schema
const cartsDataSchema = new mongoose.Schema({
    productId: {
        type: String,
        required: true
    },
    qty: {
        type: Number,
        required: false
    },
    userId: {
        type: String,
        required: true
    },
    size: {
        type: String,
        required: true
    },
    product: {
        type: Object,
        required: true
    },
    completed: {
        type: Boolean,
        required: true
    },
    payment: {
        type: Boolean,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})
const carts = mongoose.model('carts', cartsDataSchema)
module.exports = carts