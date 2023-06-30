const invoiceSchema = require("../models/invoice");
const stockSchema = require("../models/stock");
const mongoose = require("mongoose");

const { addStock } = require("./stock");
const invoice = require("../models/invoice");

const addTransaction = async (req, res) => {
  try {
    const Transaction = new invoiceSchema({
      clientName: req.body.clientName,
      id: req.body.id,
      invoiceDate: req.body.invoiceDate,
      type: req.body.type,
      products: req.body.products,
    });

    const transactionSave = await Transaction.save();
    if (transactionSave) {
      const bulkWriteData = [];
      req.body.products.forEach((stockUpdate) => {
        let count = stockUpdate.quantity || 0;
        if (req.body.type === "sell") {
          count = stockUpdate.quantity * -1;
        }
        const data = {
          updateOne: {
            filter: {
              productId: new mongoose.Types.ObjectId(
                stockUpdate?.isSegregated
                  ? stockUpdate.from
                  : stockUpdate.productId
              ),
            },
            update: { $inc: { quantity: count } },
            upsert: true,
          },
        };
        bulkWriteData.push(data);

        if (stockUpdate?.isSegregated) {
          const data2 = {
            updateOne: {
              filter: {
                productId: new mongoose.Types.ObjectId(stockUpdate.leftOver),
              },
              update: { $inc: { quantity: count * -1 } },
              upsert: true,
            },
          };
          bulkWriteData.push(data2);
        }
      });
      if (bulkWriteData.length > 0) {
        const updateStockCollection = await stockSchema.bulkWrite(
          bulkWriteData
        );
        if (updateStockCollection) {
          return res.send({
            status: 200,
            message: "transaction added successfully",
            data: updateStockCollection,
          });
        } else {
          return res.send({
            status: 400,
            message: "unexpected error occured",
            data: "updateStockCollection",
          });
        }
      }
    } else {
      return res.send({
        status: 400,
        message: "Unexpected error occured",
        process: "transactions",
      });
    }
  } catch (err) {
    console.log(err);
    return res.send({
      status: 400,
      message: err,
      process: "transaction",
    });
  }
};

const getTransaction = async (req, res) => {
  try {
    invoiceSchema
      .find({})
      .populate([
        { path: "products.productId", model: "Product-Master",
        populate:{path:'subCategoryId',model:'SubCategory',select:{_id:0,name:1,categoryId:1},
        populate:{path:'categoryId',model:'Category',select:{_id:0,name:1}},},  },
        { path: "clientName", model: "Client",select:{_id:0,name:1} },
      ]).then(async (transactions) => {
        let result=[]
        if (transactions) {
            transactions.forEach(invoice => {
                const {products}=invoice;
                products.forEach((data,index) => {
                    let tempResult={}
                    const {quantity,productId }=data
                    const {name,code,size,subCategoryId}=productId;
                    tempResult.invoiceDate=invoice.invoiceDate;
                    tempResult.invoiceNo=invoice.id;
                    tempResult.type=invoice.type;
                    tempResult.clientName=invoice.clientName.name;
                    tempResult.name=name;
                    tempResult.code=code;
                    tempResult.size=size;
                    tempResult.quantity=quantity;
                    tempResult.subCategory=subCategoryId.name;
                    tempResult.category=subCategoryId.categoryId.name;
                    result.push(tempResult)
                });
            });
          return res.send({
            status: 200,
            data: result,
            totalMessages: result.length,
            process: "transactions",
          });
        } else {
          return res.send({
            status: 200,
            data: transactions,
            message: "transactions does not exist",
            process: "transactions",
          });
        }
      })
      .catch((err) => {
        console.log(err);
        return res.send({ status: 400, message: err, process: "transactions" });
      });
  } catch (err) {
    console.log(err);
    return res.send({
      status: 400,
      message: err,
      process: "transactions",
    });
  }
};

module.exports = { addTransaction, getTransaction };
