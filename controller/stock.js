const productMasterSchema = require('../models/product-master');
const stock = require('../models/stock');
const stockSchema = require('../models/stock');
var async = require("async");

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

                stocks.map(d => {
                    d.data.map(dd => {
                        d[dd.size] = dd.quantity;
                    })
                })


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
        productMasterSchema.aggregate([
            {
                $lookup: {
                    from: "Stocks",
                    localField: "_id",
                    foreignField: "productId",
                    as: "data"
                }
            }, {
                $unwind: {
                    path: "$data",
                    preserveNullAndEmptyArrays: true
                }
            },{
                $addFields:{
                    'quantity': '$data.quantity'
                }
            }
        ])
            .then(async stocks => {

                stocks.map(d => {
                    d.data.map(dd => {
                        d[dd.size] = dd.quantity;
                    })
                })


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