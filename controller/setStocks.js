const productMasterSchema = require('../models/product-master');
const sizeSchema = require('../models/size-master');
const mongoose = require('mongoose');
const csvtojson = require("csvtojson");
const stockSchema = require('../models/stock');


const setStocks = (req, res) => {
    try {
        var products;
        productMasterSchema.find()
            .then(async product => {
                if (product) {
                    products = product;
                    let filePath = './public' + '/excelUploads/' + req.file.filename;

                    var arrayToInsert = [];
                    var invalidProducts = [];
                    await csvtojson().fromFile(filePath).then(async source => {
                        // Fetching the all data from each row
                        for (var i = 0; i < source.length; i++) {
                            let ProductId = products.filter(p => p.name === source[i]['Product Name'] && p.size === source[i]['Size']);
                            if (!ProductId.length)
                                invalidProducts.push({ name: source[i]['Product Name'], size: source[i]['Size'], quantity: source[i]['Quantity'] });
                            else {
                                let singleRow = {
                                    productId: ProductId[0]._id,
                                    quantity: source[i]['Quantity'] || 0
                                }
                                arrayToInsert.push(singleRow);
                            }
                        }
                    })
                    // if (invalidProducts.length)
                    //     return res.send({ status: 400, data: invalidProducts, message: 'Invalid Products', process: "SetStocks" })
                    // console.log(arrayToInsert);

                    stockSchema.insertMany(arrayToInsert)
                        .then(products => {
                            return res.send({ status: 200, data: products, message: 'Stocks uploaded successfully', process: 'SetStocks' })
                        })
                        .catch(err => {
                            return res.send({ status: 400, message: err, process: 'SetStocks' })
                        })
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
            status: 400, message: err.message, process: 'SetStocks'
        });
    }
}

module.exports = { setStocks }