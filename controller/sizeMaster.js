const sizeSchema = require('../models/size-master');


const addSize = async (req, res) => {
    try {

        const size = new sizeSchema({
            size: req.body.size,
            categoryId: req.body.categoryId
        })

        sizeSchema.findOneAndUpdate({ categoryId: req.body.categoryId }, { $push: { size: { $each: req.body.size } } })
            .then(async update => {
                if (update) {
                    res.send({ status: 200, data: update, process: "size" })
                } else {
                    await size.save()
                        .then(result => {
                            res.send({ status: 200, data: result, process: "size" })
                        })
                        .catch(err => {
                            res.send({ status: 400, data: err, process: "size" })
                        })
                }
            })

    }
    catch (err) {
        
        return res.send({
            status: 400, message: err, process: 'size'
        });
    }
}

const getSizes = async (req, res) => {
    try {
        sizeSchema.aggregate([
            {
                $lookup: {
                    from: 'categories',
                    localField: 'categoryId',
                    foreignField: '_id',
                    as: 'categoryId'
                }
            }
        ])
            .then(async size => {
                if (size) {
                    return res.send({ status: 200, data: size, process: 'size' })
                } else {
                    return res.send({ status: 200, data: size, message: 'size does not exist', process: 'size' })
                }
            })
            .catch(err => {
                
                return res.send({ status: 400, message: err, process: 'size' })
            })
    }
    catch (err) {
        
        return res.send({
            status: 400, message: err, process: 'size'
        });
    }
}

module.exports = { addSize, getSizes }

