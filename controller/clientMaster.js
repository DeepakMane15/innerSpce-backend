const clientSchema = require('../models/client-master');


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
                console.log(err)

            })


    }
    catch (err) {
        console.log(err)
        return res.send({
            status: 400, message: err, process: 'client'
        });
    }
}

const getclients = async (req, res) => {
    try {
        clientSchema.find()
            .then(async client => {
                if (client) {
                    return res.send({ status: 200, data: client, process: 'client' })
                } else {
                    return res.send({ status: 200, data: client, message: 'client does not exist', process: 'client' })
                }
            })
            .catch(err => {
                console.log(err)
                return res.send({ status: 400, message: err, process: 'client' })
            })
    }
    catch (err) {
        console.log(err)
        return res.send({
            status: 400, message: err, process: 'client'
        });
    }
}

module.exports = { addclient, getclients }

