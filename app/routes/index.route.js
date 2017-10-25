const router = require('express').Router();
const indexController = require('../controllers/index.controller');
const authController = require('../controllers/auth.controller');

const prefix = '/';
router.get('/', authController.loginPage);
router.get('/index', authController.isLogin, indexController.index);

module.exports = function (app) {
  app.use(prefix, router);
};
