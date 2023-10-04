const { Timestamp } = require('mongodb');
const mongoose = require('mongoose')

const productMasterSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
    },
    code: {
        type: String,
        required: true
    },
    packingType: {
        type: String,
        required: true
    },
    categoryId:
    {
        type: mongoose.Schema.ObjectId,
        required: true
    },
    subCategoryId:
    {
        type: mongoose.Schema.ObjectId,
        required: true,
    },
    size: {
        type: String,
        required: false,
        default: "",
        trim: true
    },
    status: {
        type: Boolean,
        default: 1
    }
},
    { timestamp: true });

module.exports = mongoose.model('Product-Master', productMasterSchema)