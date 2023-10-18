const { Timestamp } = require('mongodb');
const mongoose = require('mongoose')

const roleSchema = new mongoose.Schema({
    tid: { type: mongoose.Schema.ObjectId, required: true },
    name: { type: String, required: true, unique: true, trim: true },
    permissions: { type: Object, requird: true },
    status: { type: Boolean, default: true }
},
    { timestamp: true });

module.exports = mongoose.model('role', roleSchema)