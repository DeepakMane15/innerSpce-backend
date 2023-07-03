const { Timestamp } = require('mongodb');
const mongoose = require('mongoose')

const clientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    address: {
        type: String,
        required: true,
        trim: true
    },
    gstNo: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    state: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    contactNo: {
        type: Number,
        required: true,
        unique: true,
        trim: true
    }
},
    { timestamp: true });

module.exports = mongoose.model('Client', clientSchema)