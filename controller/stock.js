const productMasterSchema = require('../models/product-master');
const stockSchema = require('../models/stock');
const _ = require("lodash");
const mongoose = require("mongoose");



const addStock = async (data) => {
    try {

        data.forEach(async d => {
            console.log(d)
            d.quantities.forEach(async q => {


                const Stock = new stockSchema({
                    name: d.name + "|" + q.size,
                    code: d.code,
                    quantity: q.quantity
                })
                await stockSchema.findOne({ name: d.name + "|" + q.size })
                    .then(async res => {
                        if (res) {

                        } else {
                            await Stock.save().then((stock) => {
                                console.log(stock)
                            })
                                .catch(err => {
                                    console.log(err)
                                })
                        }
                    })

            })
        })
    }
    catch (err) {
        console.log(err)
        return ({
            status: 400, message: err, process: 'stock'
        });
    }
}

const getStocks1 = async (req, res) => {
    try {
        stockSchema.aggregate([
            {
                $lookup: {
                    from: "product-masters",
                    localField: "productId",
                    foreignField: "_id",
                    as: "product"
                }
            }, {
                $unwind: {
                    path: "$product",
                    preserveNullAndEmptyArrays: true
                }
            }, {
                $project: {
                    "ProductName": "$product.name",
                    "_id": 1,
                    "productId": 1,
                    "quantity": 1,
                    "size": "$product.size"
                }
            }
            , {
                $group: {
                    _id: "$ProductName",
                    data: {
                        $push: "$$ROOT",
                    },
                },
            },
        ])
            .then(async stocks => {
                const distinctStocks = stocks.groupBy(product => { return product.name });
                console.log("disctinct:================>", distinctStocks);
                // stocks.map(d => {
                //     d.data.map(dd => {
                //         d[dd.size] = dd.quantity;
                //     })
                // })


                if (stocks) {
                    return res.send({ status: 200, data: stocks, totalMessages: stocks.length, process: 'stock1' })
                } else {
                    return res.send({ status: 200, data: stocks, message: 'stocks does not exist', process: 'stock' })
                }
            })
            .catch(err => {
                console.log(err)
                return res.send({ status: 400, message: err, process: 'stock' })
            })
    }
    catch (err) {
        console.log(err)
        return res.send({
            status: 400, message: err, process: 'stock'
        });
    }
}

const getStocks = async (req, res) => {
    try {

        let filterObj;
        let catObj = req.query.categoryId ? { categoryId: new mongoose.Types.ObjectId(req.query.categoryId) } : {};
        let subCatObj = req.query.subCategoryId ? { subCategoryId: new mongoose.Types.ObjectId(req.query.subCategoryId) } : {};

        if (req.query.categoryId && req.query.subCategoryId) {
            filterObj = { $and: [catObj, subCatObj] };
        }
        else if (req.query.categoryId || req.query.subCategoryId) {
            filterObj = { $or: [catObj, subCatObj] };
        }
        else {
            filterObj = {}
        }

        console.log(filterObj)


        productMasterSchema.aggregate([
            {
                '$match': filterObj
            },
            {
                '$lookup': {
                    'from': 'stocks',
                    'localField': '_id',
                    'foreignField': 'productId',
                    'as': 'data'
                }
            }, {
                '$unwind': {
                    'path': '$data',
                    'preserveNullAndEmptyArrays': true
                }
            }, {
                '$project': {
                    'name': 1,
                    'categoryId': 1,
                    'subCategoryId': 1,
                    'size': 1,
                    'code': 1,
                    'quantity': '$data.quantity'
                }
            }
        ]
        )
            .then(async stocks => {

                let finalResult = []
                stocks.forEach(stock => {
                    const temp = {};
                    const { name, code, size, quantity } = stock;
                    const productIndex = finalResult.findIndex(a => a.code === code)
                    if (finalResult.length === 0 || productIndex < 0) {
                        temp.name = name;
                        temp.code = code;
                        temp[size] = quantity || 0;
                        finalResult.push(temp)
                    } else {
                        finalResult[productIndex][size] = quantity || 0;
                    }
                });


                if (finalResult.length) {
                    return res.send({ status: 200, data: finalResult, totalMessages: finalResult.length, process: 'stock1' })
                } else {
                    return res.send({ status: 200, data: finalResult, message: 'stocks does not exist', process: 'stock' })
                }
            })
            .catch(err => {
                console.log(err)
                return res.send({ status: 400, message: err, process: 'stock' })
            })
    }
    catch (err) {
        console.log(err)
        return res.send({
            status: 400, message: err, process: 'stock'
        });
    }
}


const addKey = async (stocks) => {

    await stocks.forEach(s => {
        console.log(s)
        s.type.filter(t => {
            s[t.size] = t.value
        })
    })
    console.log(stocks)
    return stocks;
}


module.exports = { addStock, getStocks }