var express = require('express');
var router = express.Router();
const multer = require('multer');

var excelStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/excelUploads');      // file added to the public folder of the root directory
    },
    filename: (req, file, cb) => {
        
        cb(null, file.originalname);
    }
});
var excelUploads = multer({ storage: excelStorage });


const { requireSignin } = require('../middleware');
const { addProductMaster, getProductMaster, bulkUpload } = require('../controller/productMaster');


/* GET users listing. */
router.post('/', requireSignin, addProductMaster);
router.get('/get', requireSignin, getProductMaster);
router.post('/bulkUpload', requireSignin, excelUploads.single("uploadfile"), bulkUpload);



module.exports = router;
