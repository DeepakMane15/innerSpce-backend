var express = require('express');
var router = express.Router();

const { addStock, getStocks } = require('../controller/stock');
const { requireSignin } = require('../middleware');

const multer = require('multer');
const { setStocks } = require('../controller/setStocks');

var excelStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/excelUploads');      // file added to the public folder of the root directory
    },
    filename: (req, file, cb) => {

        cb(null, file.originalname);
    }
});
var excelUploads = multer({ storage: excelStorage });


/* GET users listing. */
router.post('/', requireSignin, addStock);
router.get('/get', requireSignin, getStocks);

router.post('/setStocks', requireSignin, excelUploads.single("uploadfile"), setStocks);



module.exports = router;
