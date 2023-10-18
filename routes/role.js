var express = require('express');
var router = express.Router();

const { requireSignin } = require('../middleware');
const { addRole, getRoles, updateRole, deleteRole } = require('../controller/role');


/* GET users listing. */
router.post('/', requireSignin, addRole);
router.get('/get', requireSignin, getRoles);
router.put('/update', requireSignin, updateRole);
router.put('/delete', requireSignin, deleteRole);




module.exports = router;
