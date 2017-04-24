var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
var validator = require('express-validator');
var MongoStore = require('connect-mongo')(session);



//conectando mongodb
mongoose.Promise = require('bluebird');
mongoose.connect('localhost:27017/demands-scheduler');


//Rotas
var index = require('./routes/index');
var dashboard = require('./routes/dashboard');
var areas = require('./routes/areas');


var app = express();

require('./config/passport');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({secret: 'mysecret', 
                 resave: false, 
                 saveUninitialized: false,
                 store: new MongoStore({
                   mongooseConnection: mongoose.connection,
                   ttl: 3 * 60 * 60 //3 horas. Número dado em segundos
                 }),
                 cockie: { maxAge: 180 * 60 * 1000 } //180 minutos, 3 horas. Número dado em ticks.
                }));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));
app.use(validator());

app.use('/', index);
app.use('/dashboard',dashboard);
app.use('/areas',areas);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
