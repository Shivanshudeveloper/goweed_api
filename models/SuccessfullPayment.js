const mongoose = require('mongoose');
// Schema
const successfullpaymentDataSchema = new mongoose.Schema({
    transactionId: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    fullName: {
        type: String,
        required: true
    },
    phoneno: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    zipcode: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})
const successfullpayments = mongoose.model('successfullpayments', successfullpaymentDataSchema)
module.exports = successfullpayments