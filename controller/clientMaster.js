const clientSchema = require('../models/client-master');
const mongoose = require('mongoose');


const addclient = async (req, res) => {
    try {

        const client = new clientSchema({
            name: req.body.name,
            address: req.body.address,
            gstNo: req.body.gstNo,
            state: req.body.state,
            contactNo: req.body.contactNo,

        })

        await client.save()
            .then(result => {
                res.send({ status: 200, data: result, process: "client" })
            })
            .catch(err => {
                res.send({ status: 400, data: err, process: "client" })
            })
    }
    catch (err) {

        return res.send({
            status: 400, message: err, process: 'client'
        });
    }
}

const getclients = async (req, res) => {
    try {
        clientSchema.find({ status: 1 })
            .then(async client => {
                if (client) {
                    return res.send({ status: 200, data: client, process: 'client' })
                } else {
                    return res.send({ status: 200, data: client, message: 'client does not exist', process: 'client' })
                }
            })
            .catch(err => {

                return res.send({ status: 400, message: err, process: 'client' })
            })
    }
    catch (err) {

        return res.send({
            status: 400, message: err, process: 'client'
        });
    }
}

const updateClient = async (req, res) => {
    try {
        const update = {
            name: req.body.name,
            address: req.body.address,
            gstNo: req.body.gstNo,
            contactNo: req.body.contactNo,
            state: req.body.state
        }

        clientSchema.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(req.body.id) }, { $set: update })
            .then(update => {
                return res.send({ status: 200, message: "Client Updated Successfully", process: 'updateClients' })
            })
            .catch(err => {
                return res.send({
                    status: 400, message: err, process: 'updateClients'
                });
            })
    }
    catch (err) {
        return res.send({
            status: 400, message: err, process: 'updateClients'
        });
    }
}

const deleteClient = async (req, res) => {
    try {
        clientSchema.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(req.body.id) }, { $set: { status: false } })
            .then(deleteClients => {
                return res.send({ status: 200, message: 'Client deleted successfully', process: 'deleteClients' })
            })
            .catch(err => {
                return res.send({
                    status: 400, message: err, process: 'deleteClients'
                });
            })
    }
    catch (err) {
        return res.send({
            status: 400, message: err, process: 'deleteClients'
        });
    }
}

module.exports = { addclient, getclients, updateClient, deleteClient }

