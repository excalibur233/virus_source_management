const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const csurf = require('csurf');
const express = require('express');
const fs = require('fs');
const path = require('path');
const session = require('express-session');

// local require
const config = require('./config');

module.exports = function () {
  const app = express();

  // view engine setup.
  app.set('views', path.join(__dirname, '../app/views'));
  app.set('view engine', 'pug');

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(session({
    saveUninitialized: true,
    resave: true,
    secret: config.serverConfig.sessionSecret,
  }));
  app.use(csurf({ cookie: true }));

  // always last, but before user middleware.
  app.use(express.static(path.join(__dirname, '../public/')));

  // register user routes here.
  require('../app/routes/auth.route')(app);
  require('../app/routes/index.route')(app);

  // catch the 404 and render the 404 page.
  app.use((req, res) => {
    res.status(404);
    res.render('404');
  });

  // error handler,
  // eslint-disable-next-line no-unused-vars.
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('500', { error: err.toString() });
  });

  return app;
};
