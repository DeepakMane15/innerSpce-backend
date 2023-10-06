var express = require('express');
var router = express.Router();

const { requireSignin } = require('../middleware');
const { addTenant, getTenants } = require('../controller/tenant');


/* GET users listing. */
router.post('/', requireSignin, addTenant);
router.get('/get', requireSignin, getTenants);
// router.put('/update', requireSignin, updateCategory);
// router.put('/delete', requireSignin, deleteCategory);




module.exports = router;
