const { Timestamp } = require('mongodb');
const mongoose = require('mongoose')

const tenantSchema = new mongoose.Schema({

    name:
    {
        type: String,
        required: true,
        trim: true
    },
    headOffice:
    {
        type: String,
        required: true,
        trim: true
    },
    state: {
        type: String,
        required: true,
        trim: true
    },

    country: {
        type: String,
        required: true,
        trim: true
    },
    gstNo: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    contactNo: {
        type: String,
        required: true,
        trim: true
    },
    subscribedOn: {
        type: String,
        required: true,
        trim: true
    },
    expiresOn: {
        type: String,
        required: true,
        trim: true
    },
    plan: {
        type: String,
        required: true,
        trim: true,
        default: 'basic'
    },
    status: {
        type: String,
        required: true,
        trim: true,
        default: 'active'
    },
    createdOn: {
        type: Date,
        required: true,
        default: Date.now()
    }
},
    { timestamp: true });

module.exports = mongoose.model('tenant', tenantSchema)