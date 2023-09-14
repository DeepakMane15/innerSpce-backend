const { Timestamp } = require('mongodb');
const mongoose = require('mongoose')

const invoiceSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    clientName: { type: mongoose.Schema.ObjectId, required: true },
    invoiceDate: { type: Date, required: true, default: new Date().now },
    type: { type: String, required: true, trim: true },
    products: [{
        productId: { type: mongoose.Schema.ObjectId, required: true },
        quantity: { type: Number, required: true },
        isSegregated: { type: Boolean, required: false, default: false },
        from: { type: mongoose.Schema.ObjectId, required: false },
        leftOver: { type: mongoose.Schema.ObjectId, required: false }
    }]
},
    { timestamp: true });

module.exports = mongoose.model('Invoice', invoiceSchema)