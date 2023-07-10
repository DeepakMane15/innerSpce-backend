var express = require('express');
var router = express.Router();

const { requireSignin } = require('../middleware');
const { addclient, getclients, updateClient, deleteClient } = require('../controller/clientMaster');


/* GET users listing. */
router.post('/', requireSignin, addclient);
router.get('/get', requireSignin, getclients);
router.put('/update', requireSignin, updateClient);
router.put('/delete', requireSignin, deleteClient);

module.exports = router;
