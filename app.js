var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');

var routes = require('./routes/index');
var users = require('./routes/users');
var posts = require('./routes/posts');
var account = require('./routes/account');

mongoose.connect('mongodb://booklog3:123456@ds053130.mongolab.com:53130/booklog3');
mongoose.connection.on('error', function() {
  console.log('MongoDB: error');
});
mongoose.connection.on('open', function() {
  console.log('MongoDB: connected');
});

var postSchema = new mongoose.Schema({
  title  :  { type: String },
  content   :  { type: String },
  timeCreated: { type: Date, default: Date.now }
});

var Post = mongoose.model('post', postSchema);

var app = express();

app.db = {
  model: {
    Post: Post
  }
};

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'booklog store' }));

app.use('/', routes);
app.use('/', posts);
app.use('/users', users);
app.use('/account', account);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers
app.use(function(err, req, res, next) {
  if (err === 'data is empty') {
    res.status(500).send('data is empty');
  } else {
    next(err);
  }
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
