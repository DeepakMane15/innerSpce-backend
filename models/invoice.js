const { Timestamp } = require('mongodb');
const mongoose = require('mongoose')

const invoiceSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    clientName: { type: mongoose.Schema.ObjectId, required: true },
    invoiceDate: { type: Date, required: true, default: new Date().now },
    type: { type: String, required: true, trim: true },
    refNo: { type: String, required: false, trim: true },
    refDate: { type: Date, required: false, default: new Date().now },
    products: [{
        productId: { type: mongoose.Schema.ObjectId, required: true },
        quantity: { type: Number, required: true },
        isSegregated: { type: Boolean, required: false, default: false },
        from: { type: mongoose.Schema.ObjectId, required: false },
        leftOver: { type: mongoose.Schema.ObjectId, required: false },
        customiseDesc: { type: Boolean, default: false },
        printableDesc: { type: String, required: false, trim: true },
        printableQty: { type: Number, required: false, trim: true },
    }],
    address: {
        type: String, required: true, trim: true
    },
    contactNo: {
        type: Number, required: true, trim: true
    }
},
    { timestamp: true });

module.exports = mongoose.model('Invoice', invoiceSchema)