var express = require('express');
var router = express.Router();

const { requireSignin } = require('../middleware');
const { addSubCategory, getSubCategories, updateSubCategory, deleteSubCategory } = require('../controller/subCategory');


/* GET users listing. */
router.post('/', requireSignin, addSubCategory);
router.get('/get', requireSignin, getSubCategories);
router.put('/update', requireSignin, updateSubCategory);
router.put('/delete', requireSignin, deleteSubCategory);

module.exports = router;
