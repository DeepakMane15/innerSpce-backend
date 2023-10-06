const moment = require('moment');
const tenantSchema = require('../models/tenant');
const mongoose = require('mongoose');


const addTenant = async (req, res) => {
    try {
console.log('asdas' + moment(req.body.expiresOn).format('YYYY-MM-DD'))

// return;
        const tenant = new tenantSchema({
            name: req.body.name,
            headOffice: req.body.headOffice,
            state: req.body.state,
            country: req.body.country,
            gstNo: req.body.gstNo,
            email: req.body.email,
            contactNo: req.body.contactNo,
            subscribedOn: moment(req.body.subscribedOn).format('YYYY-MM-DD'),
            expiresOn: moment(req.body.expiresOn).format('YYYY-MM-DD'),
            plan: req.body.plan
        })

        await tenant.save()
            .then(result => {
                res.send({ status: 200, data: result, process: "tenant" })
            })
            .catch(err => {
                res.send({ status: 400, data: err, process: "tenant" })
            })


    }
    catch (err) {
        console.log(err)
        return res.send({
            status: 400, message: err, process: 'tenant'
        });
    }
}

const getTenants = async (req, res) => {
    try {
        tenantSchema.find({ status: 'active' })
            .then(async tenant => {

                if (tenant) {
                    return res.send({ status: 200, data: tenant, process: 'tenant' })
                } else {
                    return res.send({ status: 200, data: tenant, message: 'tenant does not exist', process: 'tenant' })
                }
            })
            .catch(err => {

                return res.send({ status: 400, message: err, process: 'tenant' })
            })
    }
    catch (err) {

        return res.send({
            status: 400, message: err, process: 'tenant'
        });
    }
}

const updateTenant = async (req, res) => {
    try {
        const update = {
            name: req.body.name,
        }
        tenantSchema.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(req.body.id) }, { $set: update })
            .then(update => {
                return res.send({ status: 200, message: "Tenant Updated Successfully", process: 'updateTenant' })
            })
            .catch(err => {

                return res.send({
                    status: 400, message: err, process: 'updateTenant'
                });
            })
    }
    catch (err) {

        return res.send({
            status: 400, message: err, process: 'updateTenant'
        });
    }
}

const deleteTenant = async (req, res) => {
    try {
        tenantSchema.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(req.body.id) }, { $set: { status: false } })
            .then(deleteTenant => {
                return res.send({ status: 200, message: 'Tenant deleted successfully', process: 'deleteTenant' })
            })
            .catch(err => {

                return res.send({
                    status: 400, message: err, process: 'deleteTenant'
                });
            })
    }
    catch (err) {

        return res.send({
            status: 400, message: err, process: 'deleteTenant'
        });
    }
}

module.exports = { addTenant, getTenants, updateTenant, deleteTenant }

