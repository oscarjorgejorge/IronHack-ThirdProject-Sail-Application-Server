const express = require('express');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const cors = require('cors');

const index = require('./routes/index');
const auth = require('./routes/auth');

const app = express();

// database connection
mongoose.Promise = Promise;
mongoose.connect('mongodb://localhost/sail-users', {
  keepAlive: true,
  reconnectTries: Number.MAX_VALUE
});

app.use(cors({
  credentials: true,
  origin: ['http://localhost:4200']
}));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// --- session
app.use(session({
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 24 * 60 * 60 // 1 day
  }),
  secret: 'some-string',
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000
  }
}));

app.use((req, res, next) => {
  app.locals.user = req.session.currentUser;
  next();
});

app.use('/', index);
app.use('/auth', auth);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  res.status(404).json({error: 'not found'});
});

app.use((err, req, res, next) => {
  // always log the error
  console.error('ERROR', req.method, req.path, err);

  // only render if the error ocurred before sending the response
  if (!res.headersSent) {
    res.status(500).json({error: 'unexpected'});
  }
});

module.exports = app;
