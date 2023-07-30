const multer = require('multer');
const productMasterSchema = require('../models/product-master');
const sizeSchema = require('../models/size-master');
const mongoose = require('mongoose');
const csvtojson = require("csvtojson");
const subCategorySchema = require('../models/subCategory-master');
const categorySchema = require('../models/category-master');
const clientSchema = require('../models/client-master')

// var multer      = require('multer');



const addProductMaster = async (req, res) => {
    try {
        console.log(req.body);

        const { size } = await sizeSchema.findOne({ categoryId: new mongoose.Types.ObjectId(req.body.categoryId) }, { size: 1, _id: 0 }).lean();
        console.log(size)
        if (size.length > 0) {
            let bulkSave = [];
            const data = {
                name: req.body.name,
                code: req.body.code,
                categoryId: req.body.categoryId,
                subCategoryId: req.body.subCategoryId
            }
            size.forEach(s => {
                const saveProduct = new productMasterSchema({
                    ...data,
                    size: s
                })
                bulkSave.push(saveProduct);
            });

            // const result = await bulkSave.save()

            const result = await productMasterSchema.bulkSave(bulkSave);

            return res.send({ status: 200, message: result, process: 'product' })
            //    if(result) {

            //    }


        }
    }
    catch (err) {
        console.log(err)
        return res.send({
            status: 400, message: err, process: 'product'
        });
    }
}

const updateProduct = async (req, res) => {
    try {
        clientSchema.updateMany({}, { $set: { status: 1 } })
            .then((update) => {

                return res.send({ status: 200, data: update, process: 'products' })
            })

            .catch(err => {
                console.log(err)
                return res.send({
                    status: 400, message: err, process: 'product'
                });
            })
    }
    catch (err) {
        console.log(err)
        return res.send({
            status: 400, message: err, process: 'product'
        });
    }
}

const getProductMaster = async (req, res) => {
    try {
        // productMasterSchema.aggregate([
        //     {
        //         $lookup: {
        //             from: "categories",
        //             localField: "categoryId",
        //             foreignField: "_id",
        //             as: "category"
        //         }
        //     }, {
        //         $unwind: {
        //             path: "$category",
        //             preserveNullAndEmptyArrays: true
        //         }
        //     }, {
        //         $project: {
        //             "ProductName": "$product.name",
        //             "_id": 1,
        //             "productId": 1,
        //             "quantity": 1,
        //             "size": "$product.size"
        //         }
        //     }
        // ])


        productMasterSchema.find({ status: 1 }).populate([{ path: 'categoryId', model: 'Category', select: { name: 1, _id: 1 } }, { path: 'subCategoryId', model: 'SubCategory', select: { name: 1, _id: 1 } }])
            .then(async products => {

                let unique = products;
                if (req.query.distinct) {
                    unique = [];
                    products.forEach(p => {
                        let a = unique.filter(u => u.name === p.name);
                        if (a.length === 0) {
                            unique.push(p);
                        }
                    })
                }
                if (products) {
                    return res.send({ status: 200, data: unique, totalMessages: products.length, process: 'products' })
                } else {
                    return res.send({ status: 200, data: products, message: 'products does not exist', process: 'products' })
                }
            })
            .catch(err => {
                console.log(err)
                return res.send({ status: 400, message: err, process: 'products' })
            })
    }
    catch (err) {
        console.log(err)
        return res.send({
            status: 400, message: err, process: 'products'
        });
    }
}

const updateProductMaster = async (req, res) => {
    try {
        const update = {
            name: req.body.name,
            // code: req.body.code,
            categoryId: req.body.categoryId,
            subCategoryId: req.body.subCategoryId
        }
        console.log(update, req.body.id);
        productMasterSchema.findOneAndUpdate({ code: req.body.code }, { $set: update })
            .then(update => {
                return res.send({ status: 200, message: "Product updated successfully", process: 'updateProductMaster' })
            })
            .catch(err => {
                console.log(err)

                return res.send({
                    status: 400, message: err, process: 'updateProductMaster'
                });
            })
    }
    catch (err) {
        console.log(err)

        return res.send({
            status: 400, message: err, process: 'updateProductMaster'
        });
    }
}

const deleteProductMaster = async (req, res) => {
    try {
        productMasterSchema.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(req.body.id) }, { $set: { status: false } })
            .then(deleteProduct => {
                return res.send({ status: 200, message: 'Product deleted successfully', process: 'deleteProductMaster' })
            })
            .catch(err => {
                console.log(err)

                return res.send({
                    status: 400, message: err, process: 'deleteProductMaster'
                });
            })
    }
    catch (err) {
        console.log(err)

        return res.send({
            status: 400, message: err, process: 'deleteProductMaster'
        });
    }
}

const bulkUpload = (req, res) => {
    try {
        var categories, subCategories;
        categorySchema.find()
            .then(async category => {
                if (category) {
                    categories = category;
                    subCategorySchema.find()
                        .then(async subCategory => {
                            subCategories = subCategory;
                            const size = await sizeSchema.find();
                            let filePath = './public' + '/excelUploads/' + req.file.filename;

                            var arrayToInsert = [];
                            await csvtojson().fromFile(filePath).then(async source => {
                                // Fetching the all data from each row
                                for (var i = 0; i < source.length; i++) {
                                    let categoryId = await getIdByName(source[i]["category"], categories);
                                    let subCategoryId = await getIdByName(source[i]["subCategory"], subCategories);
                                    // console.log(categoryId);
                                    // console.log(subCategoryId)
                                    if (!categoryId || !subCategoryId) {
                                        return res.send({ status: 400, data: [source[i]["category"], source[i]["subCategory"]], message: 'Invalid Category or subCategory added at index ' + i, process: 'category' })
                                    }

                                    let filterSize = await size.filter(s => s.categoryId.equals(categoryId));
                                    if (filterSize.length === 0) {
                                        return res.send({ status: 400, message: "Sizes dont exist for category " + source[i]["category"], process: 'ProductMaster' })

                                    }
                                    filterSize[0].size.map(s => {
                                        var singleRow = {
                                            categoryId: categoryId,
                                            subCategoryId: subCategoryId,
                                            code: source[i]["code"],
                                            name: source[i]["name"],
                                            size: s

                                        };
                                        arrayToInsert.push(singleRow);
                                    })

                                    console.log(arrayToInsert);
                                }
                                productMasterSchema.insertMany(arrayToInsert)
                                    .then(products => {
                                        return res.send({ status: 200, data: products, message: 'Products uploaded successfully', process: 'ProductMaster' })
                                    })
                                    .catch(err => {
                                        return res.send({ status: 400, message: err, process: 'ProductMaster' })
                                    })
                            })

                        })
                        .catch(err => {
                            console.log(err)
                            return res.send({ status: 400, message: err, process: 'ProductMaster' })
                        })

                } else {
                    return res.send({ status: 400, message: 'unexpected error occured', process: 'ProductMaster' })
                }
            })
            .catch(err => {
                console.log(err)
                return res.send({ status: 400, message: err, process: 'ProductMaster' })
            })

    }
    catch (err) {
        console.log(err)
        return res.send({
            status: 400, message: err, process: 'products'
        });
    }
}

const getIdByName = async (name, collection) => {
    let id = await collection.filter(c => c.name === name);
    if (id.length > 0)
        return id[0]._id;

    return null;

}


module.exports = { addProductMaster, getProductMaster, bulkUpload, updateProductMaster, deleteProductMaster, updateProduct }