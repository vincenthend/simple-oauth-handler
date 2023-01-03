var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var apisRouter = require('./routes/api');
var loginRouter = require('./routes/login');
var indexRouter = require('./routes/');
const {Server} = require('socket.io')
const http = require('http')
const cors = require('cors')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors())


// websocket
const server = http.createServer(app)
const io = new Server(server, { path: '/ws' })
io.on('connection', (socket) => {
  const state = socket.handshake.query.state
  console.log(`${socket.id} connected`)
  socket.join(state)
})

app.use(function(req,res,next){
  req.io = io
  next()
})

app.use('/', indexRouter);
app.use('/api', apisRouter);
app.use('/login_success', loginRouter);

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

module.exports = server;
