var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const { Pool } = require('pg')
const pool = new Pool({
  user: 'tazakka',
  host: 'localhost',
  database: 'posdb',
  password: '1234',
  port: 5432,
})

var indexRouter = require('./routes/index');
var dashboardRouter = require('./routes/dashboard')(pool);
var supplierRouter = require('./routes/supplier')(pool);
var productRouter = require('./routes/product')(pool);
var stockRouter = require('./routes/stock')(pool);
var costumerRouter = require('./routes/costumer')(pool);
// var newsaleRouter = require('./routes/newsale')(pool);
// var supplierRouter = require('./routes/supplier')(pool);
// var addsupplierRouter = require('./routes/supplier/addsupplier')(pool);
// var supplierlistRouter = require('./routes/supplier/supplierlist')(pool);
// var barangRouter = require('./routes/barang')(pool);
// var penjualanRouter = require('./routes/penjualan')(pool);
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/dashboard', dashboardRouter);
app.use('/supplier', supplierRouter);
app.use('/product', productRouter);
app.use('/stock', stockRouter);
app.use('/costumer', costumerRouter);

// app.use('/newsale', newsaleRouter);
// app.use('/supplier', supplierRouter);
// app.use('/addsupplier', addsupplierRouter);
// app.use('/supplierlist', supplierlistRouter);
// app.use('/barang', barangRouter);
// app.use('/penjualan', penjualanRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
