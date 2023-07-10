const categorySchema = require('../models/category-master');
const mongoose = require('mongoose');


const addCategory = async (req, res) => {
    try {

        const category = new categorySchema({
            name: req.body.name
        })

        await category.save()
            .then(result => {
                res.send({ status: 200, data: result, process: "category" })
            })
            .catch(err => {
                res.send({ status: 400, data: err, process: "category" })
                console.log(err)

            })


    }
    catch (err) {
        console.log(err)
        return res.send({
            status: 400, message: err, process: 'category'
        });
    }
}

const getCategories = async (req, res) => {
    try {
        categorySchema.find({ status: true })
            .then(async category => {
                console.log(category)
                if (category) {
                    return res.send({ status: 200, data: category, process: 'category' })
                } else {
                    return res.send({ status: 200, data: category, message: 'category does not exist', process: 'category' })
                }
            })
            .catch(err => {
                console.log(err)
                return res.send({ status: 400, message: err, process: 'category' })
            })
    }
    catch (err) {
        console.log(err)
        return res.send({
            status: 400, message: err, process: 'category'
        });
    }
}

const updateCategory = async (req, res) => {
    try {
        const update = {
            name: req.body.name,
        }
        console.log(update, req.body.id);
        categorySchema.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(req.body.id) }, { $set: update })
            .then(update => {
                return res.send({ status: 200, message: "Category Updated Successfully", process: 'updateCategory' })
            })
            .catch(err => {
                console.log(err)

                return res.send({
                    status: 400, message: err, process: 'updateCategory'
                });
            })
    }
    catch (err) {
        console.log(err)

        return res.send({
            status: 400, message: err, process: 'updateCategory'
        });
    }
}

const deleteCategory = async (req, res) => {
    try {
        categorySchema.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(req.body.id) }, { $set: { status: false } })
            .then(deleteCategory => {
                return res.send({ status: 200, message: 'Category deleted successfully', process: 'deleteCategory' })
            })
            .catch(err => {
                console.log(err)

                return res.send({
                    status: 400, message: err, process: 'deleteCategory'
                });
            })
    }
    catch (err) {
        console.log(err)

        return res.send({
            status: 400, message: err, process: 'deleteCategory'
        });
    }
}

module.exports = { addCategory, getCategories, updateCategory, deleteCategory }

