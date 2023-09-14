var express = require('express');
var router = express.Router();

const { requireSignin } = require('../middleware');
const { addProductMaster, getProductMaster } = require('../controller/productMaster');
const { addTransaction, getTransaction, getTransactionById, deleteTransactionById } = require('../controller/invoice');
const { generateInvoice } = require('../controller/invoiceGenerator');


/* GET users listing. */
router.post('/', requireSignin, addTransaction);
router.get('/get', requireSignin, getTransaction);
router.get('/get/:id', requireSignin, getTransactionById);

router.post('/download-invoice', requireSignin, generateInvoice);

router.get('/deleteTransaction/:id', requireSignin, deleteTransactionById);

// router.get('/get/:categoryId/:subCategoryId/:productId', requireSignin, getTransaction);




module.exports = router;
