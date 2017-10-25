const router = require('express').Router();
const indexController = require('../controllers/index.controller');

const prefix = '/';
router.get('/', indexController.index);
router.get('/index', indexController.index);

module.exports = function (app) {
  app.use(prefix, router);
};
