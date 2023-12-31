const { Timestamp } = require('mongodb');
const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true, trim: true },
    hasSize: { type: Boolean, required: true, default: true },
    status: { type: Boolean, default: 1 }
},
    { timestamp: true });

module.exports = mongoose.model('Category', categorySchema)