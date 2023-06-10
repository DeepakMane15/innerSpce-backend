var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')
var bodyParser = require('body-parser')

var indexRouter = require('./routes/index');
var stocksRouter = require('./routes/stock');
var usersRouter = require('./routes/users');
var masterRouter = require('./routes/master');
var transactionRouter = require('./routes/transaction');
// var usersRouter = require('./routes/users');



const connectDB = require('./classes/db');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

connectDB()
app.use(cors());
app.use(bodyParser())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/stocks', stocksRouter);
app.use('/users', usersRouter);
app.use('/master', masterRouter);
app.use('/transaction', transactionRouter);
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