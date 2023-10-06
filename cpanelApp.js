const express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')
var bodyParser = require('body-parser')

const app = express();
const PORT = 3100;

var indexRouter = require('./routes/index');
var stocksRouter = require('./routes/stock');
var usersRouter = require('./routes/users');
var productRouter = require('./routes/product');
var invoiceRouter = require('./routes/invoice');
var categoryRouter = require('./routes/category');
var subCategoryRouter = require('./routes/subCategory');
var sizeRouter = require('./routes/size');
var clientRouter = require('./routes/client');
var tenantRouter = require('./routes/tenant');

const connectDB = require('./classes/db');


// Define routes
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


connectDB()
app.use(cors());
// app.use(bodyParser())
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(logger('dev'));
app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', indexRouter);
app.use('/api/stocks', stocksRouter);
app.use('/api/users', usersRouter);
app.use('/api/product', productRouter);
app.use('/api/transaction', invoiceRouter);
app.use('/api/category', categoryRouter);
app.use('/api/subCategory', subCategoryRouter);
app.use('/api/size', sizeRouter);
app.use('/api/client', clientRouter);
app.use('/api/tenant', tenantRouter);

// app.use('/api', indexRouter);


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}/`);
});
