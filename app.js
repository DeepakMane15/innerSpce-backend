var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')
var bodyParser = require('body-parser')
var multer = require('multer');


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
var roleRouter = require('./routes/role');



// var usersRouter = require('./routes/users');



const connectDB = require('./classes/db');
const categoryMaster = require('./models/category-master');

var app = express();

// view engine setup
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

app.use('/', indexRouter);
app.use('/stocks', stocksRouter);
app.use('/users', usersRouter);
app.use('/product', productRouter);
app.use('/transaction', invoiceRouter);
app.use('/category', categoryRouter);
app.use('/subCategory', subCategoryRouter);
app.use('/size', sizeRouter);
app.use('/client', clientRouter);
app.use('/tenant', tenantRouter);
app.use('/roles', roleRouter);


// app.use('/master', masterRouter);




// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
