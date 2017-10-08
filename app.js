const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

const server = require('http').createServer(app);
const io = require('socket.io')(server);

const config = require('./config');
const routes = require('./routes');

mongoose.Promise = global.Promise;
mongoose.connect(config.db.url);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.on('open', () => {
  console.log('Connected to database!');
});

io.on('connection', socket => {
  console.log(`User connected: ${socket.id}`);

  socket.on('data', data => {
    console.log(`New query submitted: ${data.username}`);
    routes().locals.returnData(data.username, socket);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

app.use(express.static(path.join(__dirname, 'client/dist')));

app.use('/', routes);

app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  return next(err);
});

app.use((err, req, res) => {
  res.status(err.status || 500);
  if (err.status === 404) {
    return res.render('error');
  }
  return res.json({
    success: false,
    message: 'Something unexpected happened. Please wait a bit and try again.',
  });
});

server.listen(8080, () => {
  console.log('Unwanted site listening on port 8080!');
});

module.exports = app;
