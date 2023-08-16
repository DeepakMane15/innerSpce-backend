const subCategorySchema = require('../models/subCategory-master');
const mongoose = require('mongoose');

const addSubCategory = async (req, res) => {
    try {
        const subCategory = new subCategorySchema({
            name: req.body.name,
            categoryId: req.body.categoryId
        })

        await subCategory.save()
            .then(result => {
                res.send({ status: 200, data: result, process: "category" })
            })
            .catch(err => {
                res.send({ status: 400, data: err, process: "category" })
            })


    }
    catch (err) {
        
        return res.send({
            status: 400, message: err, process: 'category'
        });
    }
}

const getSubCategories = async (req, res) => {
    try {
        subCategorySchema.aggregate([
            {
                $lookup: {
                    from: 'categories',
                    localField: 'categoryId',
                    foreignField: '_id',
                    as: 'categoryId'
                }
            }
        ])
            .then(async category => {
                if (category) {
                    return res.send({ status: 200, data: category, process: 'subCategorySchema' })
                } else {
                    return res.send({ status: 200, data: category, message: 'subCategorySchema does not exist', process: 'subCategorySchema' })
                }
            })
            .catch(err => {
                
                return res.send({ status: 400, message: err, process: 'subCategorySchema' })
            })
    }
    catch (err) {
        
        return res.send({
            status: 400, message: err, process: 'subCategorySchema'
        });
    }
}

const updateSubCategory = async (req, res) => {
    try {
        const update = {
            name: req.body.name,
            categoryId: req.body.categoryId
        }
        console.log(update, req.body.id);
        subCategorySchema.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(req.body.id) }, { $set: update })
            .then(update => {
                return res.send({ status: 200, message: "SubCategory Updated Successfully", process: 'updateSubCategory' })
            })
            .catch(err => {
                

                return res.send({
                    status: 400, message: err, process: 'updateSubCategory'
                });
            })
    }
    catch (err) {
        

        return res.send({
            status: 400, message: err, process: 'updateSubCategory'
        });
    }
}

const deleteSubCategory = async (req, res) => {
    try {
        subCategorySchema.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(req.body.id) }, { $set: { status: false } })
            .then(deleteSubCategory => {
                return res.send({ status: 200, message: 'SubCategory deleted successfully', process: 'deleteSubCategory' })
            })
            .catch(err => {
                
                return res.send({
                    status: 400, message: err, process: 'deleteSubCategory'
                });
            })
    }
    catch (err) {
        
        return res.send({
            status: 400, message: err, process: 'deleteSubCategory'
        });
    }
}

module.exports = { addSubCategory, getSubCategories, updateSubCategory, deleteSubCategory }

