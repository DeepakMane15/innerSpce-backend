var express = require('express');
var router = express.Router();

const { requireSignin } = require('../middleware');
const { addProductMaster, getProductMaster } = require('../controller/productMaster');
const { addCategory, getCategories, updateCategory, deleteCategory } = require('../controller/category');


/* GET users listing. */
router.post('/', requireSignin, addCategory);
router.get('/get', requireSignin, getCategories);
router.put('/update', requireSignin, updateCategory);
router.put('/delete', requireSignin, deleteCategory);




module.exports = router;
