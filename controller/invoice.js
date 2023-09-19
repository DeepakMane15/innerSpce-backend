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
      address:req.body.address,
      contactNo:req.body.contactNo,
      // isSegregated: req.body.isSegregated,
      // segregatedFrom: req.body.segregatedFrom || null
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

    return res.send({
      status: 400,
      message: err,
      process: "transaction",
    });
  }
};

const getTransaction = async (req, res) => {
  try {
    let { subCategoryId, categoryId, productId } = req.query;

    let populateClientName = {
      path: 'clientName',
      model: 'Client'
    }
    let populateSubCategory = {
      path: 'subCategoryId',
      model: 'SubCategory',
      select: { _id: 1, name: 1, categoryId: 1 }
    }
    if (subCategoryId) {
      subCategoryId = new mongoose.Types.ObjectId(subCategoryId)
      populateSubCategory["match"] = { "_id": subCategoryId }
    }

    let populateCategory = {
      path: 'categoryId',
      model: 'Category',
      select: { _id: 1, name: 1 }
    }
    if (categoryId) {
      categoryId = new mongoose.Types.ObjectId(categoryId)
      populateCategory["match"] = { "_id": categoryId };
    }

    populateSubCategory["populate"] = populateCategory
    let populateProduct = {
      path: "products.productId",
      model: "Product-Master"
    }

    if (productId) {
      productId = new mongoose.Types.ObjectId(productId)
      populateProduct["match"] = { "_id": productId }
    }
    populateProduct["populate"] = populateSubCategory;



    let filterDate = {};

    if (req.query.startDate && req.query.endDate) {
      filterDate = {
        invoiceDate: {
          $gte: req.query.startDate ? new Date(req.query.startDate) : new Date(),
          $lt: req.query.endDate ? new Date(req.query.endDate) : new Date()
        }
      }
    }

    invoiceSchema
      .find(
        filterDate
      )
      .populate(populateProduct)
      .populate(populateClientName).then(async (transactions) => {
        if (transactions) {
          const result = processTransaction(transactions, productId, categoryId, subCategoryId);
          // console.log(result)
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

        return res.send({ status: 400, message: err, process: "transactions" });
      });
  } catch (err) {

    return res.send({
      status: 400,
      message: err,
      process: "transactions",
    });
  }
};

function processTransaction(transactions, product, subCategory, categoryId) {
  let result = []
  transactions.forEach(invoice => {
    const { products } = invoice;
    products.forEach(data => {
      let tempResult = {}
      const { quantity, productId } = data
      if (productId) {
        const { name, code, size, subCategoryId } = productId;
        if (subCategoryId || subCategoryId?.categoryId) {
          tempResult.invoiceDate = invoice.invoiceDate;
          tempResult.invoiceNo = invoice.id;
          tempResult.type = invoice.type;
          tempResult.clientName = invoice.clientName.name;
          tempResult.id = invoice._id,
          tempResult.address = invoice.address,
          tempResult.contactNo = invoice.contactNo,
          tempResult.gstNo = invoice.clientName.gstNo,
          tempResult.name = name;
          tempResult.code = code;
          tempResult.size = size;
          tempResult.quantity = quantity;
          tempResult.subCategory = subCategoryId.name;
          tempResult.category = subCategoryId.categoryId.name;
          result.push(tempResult);
        }
      }
    });
  });
  return result;
}

const getTransactionById = async (req, res) => {
  try {
    // console.log(req.params.id)

    invoiceSchema.findOne({ _id: req.params.id }).populate([
      {
        path: "products.productId", model: "Product-Master",
        populate: {
          path: 'subCategoryId', model: 'SubCategory', select: { _id: 0, name: 1, categoryId: 1 },
          populate: { path: 'categoryId', model: 'Category', select: { _id: 0, name: 1 } },
        },
      },
      { path: "clientName", model: "Client" },
    ])
      .then(transaction => {
        return res.send({
          status: 200,
          data: transaction,
          process: "getTransactionById",
        });
      })
      .catch(err => {
        return res.send({
          status: 400,
          message: err,
          process: "getTransactionById",
        });
      })

  }
  catch (err) {
    return res.send({
      status: 400,
      message: err,
      process: "transactions",
    });
  }
}

const deleteTransactionById = async (req, res) => {
  try {

    const invoiceStocks = await invoiceSchema.findOne({ _id: req.params.id });

    if (invoiceStocks) {

      const bulkWriteData = [];
      invoiceStocks.products.forEach((stockUpdate) => {
        let count = stockUpdate.quantity || 0;
        if (invoiceStocks.type === "purchase") {
          count = stockUpdate.quantity * -1;
        }


        if (stockUpdate.isSegregated) {
          const segregatedFromProductUpdate = {
            updateOne: {
              filter: {
                productId: new mongoose.Types.ObjectId(
                  stockUpdate.from
                ),
              },
              update: { $inc: { quantity: stockUpdate.quantity } },
              upsert: false,
            },
          };
          bulkWriteData.push(segregatedFromProductUpdate);
          const segregatedToProductUpdate = {
            updateOne: {
              filter: {
                productId: new mongoose.Types.ObjectId(
                  stockUpdate.leftOver
                ),
              },
              update: { $inc: { quantity: (stockUpdate.quantity * -1) } },
              upsert: false,
            },
          };
          bulkWriteData.push(segregatedToProductUpdate);
        } else {
          const data = {
            updateOne: {
              filter: {
                productId: new mongoose.Types.ObjectId(
                  stockUpdate.productId
                ),
              },
              update: { $inc: { quantity: count } },
              upsert: false,
            },
          };
          bulkWriteData.push(data);
        }

      })
      
      if (bulkWriteData.length > 0) {
        const updateStockCollection = await stockSchema.bulkWrite(
          bulkWriteData
        );
        if (updateStockCollection) {

          const deleteInvoice = await invoiceSchema.deleteOne({ _id: req.params.id });
          if (deleteInvoice) {
            return res.send({
              status: 200,
              message: "transaction deleted successfully",
              data: updateStockCollection,
            });
          } else {
            // rollback update query
          }
        } else {
          return res.send({
            status: 400,
            message: "unexpected error occured",
            process: "deleteTransactionById",
          });
        }
      }
      else {
        return res.send({
          status: 400,
          message: "Unexpected error occured",
          process: "deleteTransactionById",
        });
      }


    } else {
      return res.send({
        status: 400,
        message: "Invoice does not exist",
        process: "deleteTransactionById",
      });
    }
  }
  catch (err) {
    return res.send({
      status: 400,
      message: err,
      process: "deleteTransactionById",
    });
  }
}

module.exports = { addTransaction, getTransaction, getTransactionById, deleteTransactionById };
