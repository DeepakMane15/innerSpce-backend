const roleSchema = require('../models/role');
const mongoose = require('mongoose');


const addRole = async (req, res) => {
    try {

        const role = new roleSchema({
            tid: req.userDataFromMiddleware.tid,
            name: req.body.name,
            permissions: req.body.permissions
        })

        await role.save()
            .then(result => {
                res.send({ status: 200, data: result, process: "role" })
            })
            .catch(err => {
                res.send({ status: 400, data: err, process: "role" })
            })
    }
    catch (err) {

        return res.send({
            status: 400, message: err, process: 'role'
        });
    }
}

const getRoles = async (req, res) => {
    try {
        roleSchema.find({ status: true })
            .then(async role => {

                if (role) {
                    return res.send({ status: 200, data: role, process: 'role' })
                } else {
                    return res.send({ status: 200, data: role, message: 'role does not exist', process: 'role' })
                }
            })
            .catch(err => {

                return res.send({ status: 400, message: err, process: 'role' })
            })
    }
    catch (err) {

        return res.send({
            status: 400, message: err, process: 'role'
        });
    }
}

const updateRole = async (req, res) => {
    try {
        const update = {
            name: req.body.name,
            permissions: req.body.permissions
        }
        roleSchema.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(req.body.id) }, { $set: update })
            .then(update => {
                return res.send({ status: 200, message: "Role Updated Successfully", process: 'updateRole' })
            })
            .catch(err => {

                return res.send({
                    status: 400, message: err, process: 'updateRole'
                });
            })
    }
    catch (err) {

        return res.send({
            status: 400, message: err, process: 'updateRole'
        });
    }
}

const deleteRole = async (req, res) => {
    try {
        roleSchema.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(req.body.id) }, { $set: { status: false } })
            .then(deleteRole => {
                return res.send({ status: 200, message: 'Role deleted successfully', process: 'deleteRole' })
            })
            .catch(err => {

                return res.send({
                    status: 400, message: err, process: 'deleteRole'
                });
            })
    }
    catch (err) {

        return res.send({
            status: 400, message: err, process: 'deleteRole'
        });
    }
}

module.exports = { addRole, getRoles, updateRole, deleteRole }

