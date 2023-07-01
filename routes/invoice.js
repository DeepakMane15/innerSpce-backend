var express = require('express');
var router = express.Router();

const { requireSignin } = require('../middleware');
const { addProductMaster, getProductMaster } = require('../controller/productMaster');
const { addTransaction, getTransaction,getTransactionById } = require('../controller/invoice');


/* GET users listing. */
router.post('/', requireSignin, addTransaction);
router.get('/get', requireSignin, getTransaction);
router.get('/get/:id', requireSignin, getTransactionById);
// router.get('/get/:categoryId/:subCategoryId/:productId', requireSignin, getTransaction);




module.exports = router;
