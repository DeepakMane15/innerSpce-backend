const { Timestamp } = require('mongodb');
const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    categoryId: { type: mongoose.Schema.ObjectId, required: true },
    status: { type: Boolean, default: 1 }

},
    { timestamp: true });

module.exports = mongoose.model('SubCategory', categorySchema)